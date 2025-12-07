import React, { useState } from "react";
import MainNavBar from "./components/MainNavBar";
import { useLibrary } from "./contexts/LibraryContext";
import { AddBookForm } from "./components/AddBookForm";
import { BorrowForm } from "./components/BorrowForm";
import { AddMemberForm } from "./components/AddMemberForm";
import { ReturnForm } from "./components/ReturnForm";
import { DeleteBookForm } from "./components/DeleteBookForm";
import { DeleteMemberForm } from "./components/DeleteMemberForm";


type Panel =
  | "NONE"
  | "ADD_BOOK"
  | "ADD_MEMBER"
  | "BORROW"
  | "RETURN"
  | "DELETE_BOOK"
  | "DELETE_MEMBER";

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<Panel>("NONE");
  const { books, members, manager, refresh } = useLibrary();

  return (
    <div>
      {/* NAV BAR */}
      <MainNavBar />

      {/* CONTENT */}
      <main style={{ padding: "24px" }}>
        <h1>Library Borrowing System</h1>

        <div style={{ margin: "16px 0", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => setActivePanel("ADD_BOOK")}>Add a Book</button>
          <button onClick={() => setActivePanel("ADD_MEMBER")}>Add a Member</button>
          <button onClick={() => setActivePanel("BORROW")}>Borrow a Book</button>
          <button onClick={() => setActivePanel("RETURN")}>Return a Book</button>
          <button onClick={() => setActivePanel("DELETE_BOOK")}>Delete a Book</button>
          <button onClick={() => setActivePanel("DELETE_MEMBER")}>Delete a Member</button>
        </div>

        {/* แสดง Panel ตามปุ่มที่เลือก */}
        {activePanel === "ADD_BOOK" && (
          <AddBookForm
            onSubmit={(title, author) => {
              manager.addBook(title, author);
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}

        {activePanel === "ADD_MEMBER" && (
          <AddMemberForm
            onSubmit={name => {
              manager.addMember(name);
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}

        {activePanel === "BORROW" && (
          <BorrowForm
            books={books}
            members={members}
            onSubmit={(bookId, memberId) => {
              alert(manager.borrowBook(bookId, memberId));
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}

        {activePanel === "RETURN" && (
          <ReturnForm
            books={books}
            members={members}
            onSubmit={(bookId, memberId) => {
              alert(manager.returnBook(bookId, memberId));
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}

        {activePanel === "DELETE_BOOK" && (
          <DeleteBookForm
            books={books}
            onSubmit={bookId => {
              manager.deleteBook(bookId);
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}

        {activePanel === "DELETE_MEMBER" && (
          <DeleteMemberForm
            members={members}
            onSubmit={memberId => {
              manager.deleteMember(memberId);
              refresh();
              setActivePanel("NONE");
            }}
          />
        )}



        <hr style={{ margin: "24px 0" }} />

        <h2>Books</h2>
        <ul>
          {books.map(b => (
            <li key={b.id}>
              [{b.id}] {b.title} - {b.author} ({b.isAvailable ? "available" : "borrowed"})
            </li>
          ))}
        </ul>

        <h2>Members</h2>
        <ul>
          {members.map(m => (
            <li key={m.id}>
              [{m.id}] {m.name}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
