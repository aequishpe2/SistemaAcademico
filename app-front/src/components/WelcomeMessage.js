import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomeMessage = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Bienvenidos</h1>
      <p className="lead">Esta es la página principal de la aplicación.</p>
    </div>
  );
};

export default WelcomeMessage;
