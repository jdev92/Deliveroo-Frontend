import { useState, useEffect } from 'react';
import axios from 'axios';
import deliverooLogo from './assets/img/logo-teal.svg';
import './App.css';

function App() {

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://site--backend-deliveroo--pztpbjtb5885.code.run/");
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message)
      }
    };
    fetchData();
  }, []);

  const calculateSubtotal = () => {
    let subtotal = 0;
    cart.forEach((meal) => {
      subtotal += meal.price * meal.quantity;
    });

    const deliveryFee = 2.5;
    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total };
  }


  return isLoading ? (
    <p>En cours de chargement...</p>
  ) : (
    <div>
      <header>
        <div className="container">
          <img src={deliverooLogo} alt="logo Deliveroo" />
        </div>
      </header>
      <div className="hero">
        <div className="container inner-hero">
          <div className="left-part">
            <h1>{data.restaurant.name}</h1>
            <p>{data.restaurant.description}</p>
          </div>
          <img src={data.restaurant.picture} alt="" />
        </div>
      </div>
      <main>
        <div className="container inner-main">
          <section className="col-left">
            {data.categories.map((category) => {
              if (category.meals.length !== 0) {
                return (
                  <section key={category.name}>
                    <h2>{category.name}</h2>
                    <div className="meals-container">
                      {category.meals.map((meal) => {
                        return (
                          <article key={meal.id}>
                            <div
                              // ajout d'un repas dans le panier
                              onClick={() => {
                                console.log(meal)
                                // Rechercher l'index de l'élément existant dans le panier avec le même id que le repas cliqué
                                const existingMealIndex = cart.findIndex(elem => elem.id === meal.id);
                                // Si l'élément existe déjà dans le panier
                                if (existingMealIndex !== -1) {
                                  // Création d'une copie du panier
                                  const updatedCart = [...cart];
                                  // Incrémentation de la quantité de l'élément existant
                                  updatedCart[existingMealIndex].quantity += 1;
                                  // Mise à jour du panier avec la nouvelle copie
                                  setCart(updatedCart);
                                } else {
                                  // Si l'élément n'existe pas dans le panier, on ajoute 1
                                  setCart([...cart, { ...meal, quantity: 1 }]);
                                }
                              }}
                            >
                              <h3>{meal.title}</h3>
                              <p className="meal-description">
                                {meal.description}
                              </p>
                              <span className="meal-price">{meal.price} €</span>
                              {meal.popular === true && <span>Populaire</span>}
                            </div>

                            {meal.picture && (
                              <img src={meal.picture} alt={meal.title} />
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                );
              } else {
                return null;
              }
            })}
          </section>
          <section className="col-right">
            <h2>Panier</h2>
            <ul>
              {/* Parcourir et afficher les repas dans le panier */}
              {cart.map((meal) => (
                <li key={meal.id}>
                  <p>{meal.title}</p>
                  <p>{meal.price} € x {meal.quantity}</p>
                  <p>Sous-total {calculateSubtotal().subtotal} €</p>
                  <p>Frais de livraison{calculateSubtotal().deliveryFee} €</p>
                  <p>Total {calculateSubtotal().total} €</p>
                </li>
              ))}

            </ul>
          </section>
        </div>
      </main>
    </div>

  )

}

export default App
