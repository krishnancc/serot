import ScrollTop from "./components/ScrollTop";
import Routes from "./routes";
// import ThemeCustomization from './themes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    // <ThemeCustomization>
    <ScrollTop>
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </ScrollTop>
    // </ThemeCustomization>
  );
}

export default App;
