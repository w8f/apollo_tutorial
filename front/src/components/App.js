import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Header from "./Header";
import { Navigate, Route, Routes } from "react-router-dom";
import Search from "./Search";
import Login from "./Login";

const App = () => {
  return (
    <div className="center w85">
      <Header />
      <div className="ph3 pv1 background-gray">
        <Routes>
          <Route exact path="/" element={<Navigate replace to="/new/1" />} />
          <Route exact path="/create" element={<CreateLink />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/search" element={<Search />} />
          <Route path="/top" element={<LinkList />} />
          <Route path="/new/:page" element={<LinkList />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
