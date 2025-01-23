import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import styles from "./ProductsD.module.css";

import PageNav from "../Components/PageNav";
import StarRating from "../Components/StarRating";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watched, setWatched] = useState([]);
  console.log(loading, error);

  const selectedUserId = localStorage.getItem("userId");

  function handleSelectedID(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseProduct() {
    setSelectedId(null);
  }

  useEffect(function () {
    async function GetProducts() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      // Check if token exists
      if (!token) {
        setError("Token not found");
        setLoading(false);
        return;
      }

      try {
        // Send the request
        const response = await fetch("http://localhost:5296/api/products", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data get product");
        }

        const result = await response.json();
        setProducts(result); // Set the retrieved data
      } catch (err) {
        setError(err.message); // Set the error message if something goes wrong
      } finally {
        setLoading(false); // Stop loading
      }
    }
    GetProducts();
  }, []);

  useEffect(
    function () {
      async function getProductdetails() {
        setLoading(true);
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        // Check if token exists
        if (!token) {
          setLoading(false);
          return;
        }

        try {
          const res = await fetch(
            `http://localhost:5296/api/Review/${selectedUserId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch data get product");
          }
          const data = await res.json();

          setWatched(data);
          setLoading(false);
        } catch (err) {
          console.log(err.message); // Set the error message if something goes wrong
        } finally {
          setLoading(false); // Stop loading
        }
      }
      getProductdetails();
    },
    [selectedId, selectedUserId]
  );

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.ReviewID !== id));
  }
  /*
  function handleSelectedID(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
*/
  /*
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
*/
  return (
    <div className={styles.productPage}>
      <PageNav />
      <Main>
        <Box>
          <ProductList products={products} onSelectProduct={handleSelectedID} />
        </Box>
        <Box>
          {selectedId ? (
            <ProductDetails
              selectedId={selectedId}
              onCloseProduct={handleCloseProduct}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedProductsList
                watched={watched}
                onHandleDelete={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Main({ children }) {
  return <main className={styles.main}>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className={styles.box}>
      <button
        className={styles.btntoggle}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function ProductList({ products, onSelectProduct }) {
  return (
    <ul className={styles.list}>
      {products?.map((product) => (
        <ProductI
          product={product}
          key={product.id}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </ul>
  );
}

function ProductI({ product, onSelectProduct }) {
  return (
    <li onClick={() => onSelectProduct(product.productID)}>
      <img src={product.imageURL} alt={`${product.productName} poster`} />
      <h3>{product.productName}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{product.price}DH</span>
        </p>
      </div>
    </li>
  );
}

function ProductDetails({ selectedId, onCloseProduct, watched }) {
  console.log(selectedId);
  const [product, setProduct] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [userRating, setUserRating] = useState("");

  const isRating = watched
    .map((product) => product.productID)
    .includes(selectedId);

  useEffect(
    function () {
      async function getProductdetails() {
        setIsLoading(true);
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage

        // Check if token exists
        if (!token) {
          setIsLoading(false);
          return;
        }

        try {
          const res = await fetch(
            `http://localhost:5296/api/products/${selectedId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch data get product");
          }
          const data = await res.json();

          setProduct(data);
          setIsLoading(false);
        } catch (err) {
          console.log(err.message); // Set the error message if something goes wrong
        } finally {
          setIsLoading(false); // Stop loading
        }
      }
      getProductdetails();
    },
    [selectedId]
  );

  const selectedUserId = localStorage.getItem("userId");
  function handleAdd() {
    const addReview = {
      productID: selectedId,
      customerID: selectedUserId,
      rating: userRating,
      reviewDate: new Date().toISOString(), // Generate current date and time
    };

    async function submitReview() {
      setIsLoading(true);
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      // Check if token exists
      if (!token) {
        console.error("Token not found!");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5296/api/review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
          body: JSON.stringify(addReview), // Convert the object to a JSON string
        });

        if (!res.ok) {
          throw new Error("Failed to submit review.");
        }

        const result = await res.json(); // Parse the response, if needed
        console.log("Review submitted successfully:", result);
        onCloseProduct();
      } catch (err) {
        console.error(err.message); // Log error if something goes wrong
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
    submitReview();
  }

  /*
  const isRating = watched.map((product) => product.id).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  */
  const { productID, productName, description, details, imageURL, rating } =
    product;

  console.log(rating);
  /*
  useEffect(
    function () {
      async function getMoviedetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        ).catch(() => {
          throw new Error("this is where error happened");
        });
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviedetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useKey("Escape", onCloseMovie);
*/
  return (
    <div className={styles.details}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className={styles.btnback} onClick={onCloseProduct}>
              &larr;
            </button>
            <img src={imageURL} alt={`Poster of ${productID} product`} />
            <div className={styles.detailsoverview}>
              <h2>{productName}</h2>
              <p>{description}&bull;</p>
              <p>
                <span>✨</span>
                {rating} ÉvaluationProduit
              </p>
            </div>
          </header>

          <section>
            <div className={styles.rating}>
              {isRating ? (
                <p>
                  Vous avez évalué avec crème solaire.
                  <span>✨</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onMovieRating={setUserRating}
                  />
                  {userRating && (
                    <button className={styles.btnadd} onClick={handleAdd}>
                      + Ajouter à la liste
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{details}</em>
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function Loader() {
  return <div className="loader">Loading...</div>;
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((product) => product.product.rating)
  );
  const avgUserRating = average(watched.map((product) => product.rating));
  return (
    <div className={styles.summary}>
      <h2>Produit que tu as sélectionnée</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} Products</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

function WatchedProductsList({ watched, onHandleDelete }) {
  return (
    <ul className={styles.list}>
      {watched.map((product) => (
        <WatchedProduct
          product={product}
          onHandleDelete={onHandleDelete}
          key={product.reviewID}
        />
      ))}
    </ul>
  );
}

function WatchedProduct({ product, onHandleDelete }) {
  console.log("Product : ");
  console.log(product);
  return (
    <li>
      <img src={product.product.imageURL} alt={`${product.title} poster`} />
      <h3>{product.product.productName}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{product.product.rating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{product.rating}</span>
        </p>
        <button
          className={styles.btndelete}
          onClick={() => onHandleDelete(product.reviewID)}
        >
          ❌
        </button>
      </div>
    </li>
  );
}

WatchedProduct.propTypes = {
  product: PropTypes.node.isRequired,
  onHandleDelete: PropTypes.node.isRequired,
};
WatchedProductsList.propTypes = {
  watched: PropTypes.node.isRequired,
  onHandleDelete: PropTypes.node.isRequired,
};
WatchedSummary.propTypes = {
  watched: PropTypes.node.isRequired,
};

ProductI.propTypes = {
  product: PropTypes.node.isRequired,
  onSelectProduct: PropTypes.node.isRequired,
};

ProductList.propTypes = {
  products: PropTypes.node.isRequired,
  onSelectProduct: PropTypes.node.isRequired,
};
Main.propTypes = {
  children: PropTypes.node.isRequired,
};
Box.propTypes = {
  children: PropTypes.node.isRequired,
};

ProductDetails.propTypes = {
  selectedId: PropTypes.node.isRequired,
  onCloseProduct: PropTypes.node.isRequired,
  onAddWatched: PropTypes.node.isRequired,
  watched: PropTypes.node.isRequired,
};
