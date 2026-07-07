import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-beige-bg flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl md:text-8xl font-serif text-gold-dark mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-serif text-text-dark mb-6">Tato stránka se někam zatoulala</h2>
      <p className="text-text-muted font-light max-w-md mb-8">
        Omlouváme se, ale stránka, kterou hledáte, neexistuje. Možná byla smazána, přesunuta, nebo jste zadali špatnou adresu.
      </p>
      <a 
        href="/" 
        className="px-8 py-3 bg-gold text-white font-semibold rounded-full hover:bg-gold-dark transition-colors"
      >
        Zpět na úvodní stranu
      </a>
    </div>
  );
};

export default NotFound;
