import { useEffect, useState } from "react";

type Favorite = {
  _id: string;
  image: string;
};

export const FavoriteToggle = ({ image }:{image:string }) => {
  const [favorites, setFavorites] = useState<string[]>([]); // just the image URLs

  // Load favorites once
  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch("https://expresso-plum.vercel.app/favorite");
      const data = await res.json();
      setFavorites(data.map((fav: Favorite) => fav.image));
    };

    fetchFavorites();
  }, []);

  const isLiked = favorites.includes(image);

 const handleToggle = async () => {
  if (isLiked) {
    // Optimistically remove from UI
    setFavorites((prev) => prev.filter((img) => img !== image));

    try {
      const res = await fetch("https://expresso-plum.vercel.app/favorite");
      const data: Favorite[] = await res.json();
      const match = data.find((fav) => fav.image === image);

      if (match) {
        await fetch(`https://expresso-plum.vercel.app/favorite/${match._id}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      // Revert on failure
      setFavorites((prev) => [...prev, image]);
      console.error("Failed to remove favorite", err);
    }
  } else {
    // Optimistically add to UI
    setFavorites((prev) => [...prev, image]);

    try {
      await fetch("https://expresso-plum.vercel.app/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
    } catch (err) {
      // Revert on failure
      setFavorites((prev) => prev.filter((img) => img !== image));
      console.error("Failed to add favorite", err);
    }
  }
};


  return (
    <button onClick={(e) => { e.stopPropagation(); handleToggle(); }}>
      {isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-10 sm:h-10 fill-red-500"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09 
                C13.09 3.81 14.76 3 16.5 3 
                19.58 3 22 5.42 22 8.5 
                c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>

      ) : (
                <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 sm:w-10 sm:h-10 text-white"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 6.75a5.753 5.753 0 00-9.495-1.057L12 7.06l-.257-.367a5.753 5.753 0 00-9.495 1.058 6.234 6.234 0 001.372 7.09l7.853 7.353a.75.75 0 001.054 0l7.853-7.354a6.234 6.234 0 001.372-7.09z"
        />
        </svg>
      )}
    </button>
  );
};
