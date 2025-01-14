import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useCart } from "../../../hooks/useCart";
import { Book } from "../../../types";
import axiosInstance from "../../../utils/axiosConfig";

interface BookCardProps {
  book: any;
  onViewDetail: (book: Book) => void;
  userID: number; // Assuming userID is passed as a prop
}

export function BookCard({ book, onViewDetail }: BookCardProps) {
  const { addToCart } = useCart();
  const [favoriteId, setFavoriteId] = useState<number>(0);
  
  // Set the book image, fallback to a default image if it's not available
  const bookImage = book.categories?.[0]?.image_url || "path/to/default-image.jpg";

  // Toggle favorite status
  const toggleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.ID;
    const token = user?.token;
    try {
      if (favoriteId > 0) {
        await axiosInstance.delete(`/favorites/${favoriteId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteId(0); 
      } else {
        // Add to favorites
        const response = await axiosInstance.post(
          "/favorites/",
          { book_id: book.id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoriteId(response.data.favorite); // Store the returned favorite ID
      }
    } catch (error) {
      console.error("Error while toggling favorite:", error);
    }
  };

  useEffect(() => {
    setFavoriteId(book.id_favorite); 
  }, [book]);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={bookImage} // Use category image or fallback to default image
          alt={book.title}
          className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
          onClick={() => onViewDetail(book)}
        />
        <button
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 ${
            favoriteId > 0 ? "text-red-500" : "text-gray-600"
          }`}
          onClick={toggleFavorite}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <span className="text-sm text-indigo-600 font-medium">
          {book.categories?.[0]?.name}
        </span>

        <h3
          className="font-semibold text-lg mb-2 cursor-pointer hover:text-indigo-600"
          onClick={() => onViewDetail(book)}
        >
          {book.title}
        </h3>

        <p className="text-gray-600 mb-2">{book.author?.name}</p>

        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold">
            {book.price ? `${book.price} VND` : "Miễn phí"}
          </span>

          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => addToCart(book)}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
