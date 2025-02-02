import React from "react";
import "../style/ImageGallery.css";

const ImageGallery = () => {
  return (
    <section className="image-gallery">
      <h2>Explore Our Styles</h2>
      <div className="gallery-container">
        <div className="gallery-item">
          <img src="/path/to/gallery1.jpg" alt="Gallery Image 1" />
        </div>
        <div className="gallery-item">
          <img src="/path/to/gallery2.jpg" alt="Gallery Image 2" />
        </div>
        <div className="gallery-item">
          <img src="/path/to/gallery3.jpg" alt="Gallery Image 3" />
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
