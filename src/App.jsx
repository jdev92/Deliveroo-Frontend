import { useState, useEffect } from 'react';
import axios from 'axios';
import deliverooLogo from './assets/img/logo-teal.svg';
import './App.css';

function App() {

  const [data, setData] = useState(); // State pour stocker les données de l'API
  const [isLoading, setIsLoading] = useState(true); //Statue de chargement
  const [cart, setCart] = useState([]); // Le panier


  // Récupérer les données de l'API au montage du composant
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

  // Ajouter un repas au panier
  const handleAddToCart = (meal) => {
    const cartCopy = [...cart];
    const existingMeal = cartCopy.find((elem) => elem.id === meal.id);

    if (existingMeal) {
      existingMeal.quantity++;
    } else {
      const obj = { ...meal, quantity: 1 }
      cartCopy.push(obj);
    }
    setCart(cartCopy);
  }

  // Retirer un repas du panier
  const handleRemoveFromCart = (meal) => {
    const cartCopy = [...cart];
    // Recherche de l'élément existant dans le panier avec le même id que le repas cliqué
    const existingMeal = cart.find(elem => elem.id === meal.id);

    if (existingMeal.quantity > 1) {
      existingMeal.quantity--;
    } else {
      const index = cartCopy.indexOf(existingMeal)
      console.log(index)
      cartCopy.splice(index, 1);
    }
    setCart(cartCopy);
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
                                handleAddToCart(meal);
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
            {cart.length === 0 ? (
              <h2>Votre panier  est vide</h2>
            ) : (
              <div>
                {/* Parcourir et afficher les repas dans le panier */}
                {cart.map((meal) => (
                  <div key={meal.id}>
                    <button onClick={() => {
                      handleRemoveFromCart(meal)
                    }}
                    > -
                    </button>
                    <span>{meal.quantity}</span>
                    <button onClick={() => {
                      handleAddToCart(meal);
                    }}
                    > +
                    </button>
                    <span>{meal.title}</span>
                    <span> {(Number(meal.price))} € x {meal.quantity}</span>
                  </div>
                ))}
                <p>Frais de livraison{calculateSubtotal().deliveryFee} €</p>
                <p>Sous-total {(calculateSubtotal().subtotal).toFixed(2)} €</p>
                <p>Total {(calculateSubtotal().total).toFixed(2)} €</p>

              </div>
            )}


          </section>
        </div>
      </main>
    </div>

  )

}

export default App
