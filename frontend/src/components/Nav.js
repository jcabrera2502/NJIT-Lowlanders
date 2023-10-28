import React from 'react'; // ES6 js
import {Link} from 'react-router-dom';

function Nav() {
    return(
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark top">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="navMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navMainMenu" class="navbar-collapse collapse">
                <div class="navbar-nav ml-auto">
                    <Link to='/' className="nav-item nav-link active">Home</Link>
                    <Link to='/SignIn' className="nav-item nav-link">SignIn</Link>
                    <Link to ='/SignUp' className="nav-item nav-link">SignUp</Link>
                    <Link to ='/AuthDetails' className="nav-item nav-link">Logout</Link>
                    <Link to ='/Settings' className="nav-item nav-link">&#9881;</Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;