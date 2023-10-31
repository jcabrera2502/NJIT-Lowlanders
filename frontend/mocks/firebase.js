// __mocks__/firebase.js

const firebase = {
    // Mock any Firebase functions you're using in your code
    auth: jest.fn(() => ({
      signInWithEmailAndPassword: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
      // Add any other functions your code uses here
    })),
    initializeApp: jest.fn(),
    getAnalytics: jest.fn(),
  };
  
  export default firebase;
  