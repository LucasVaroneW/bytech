import React from 'react';
import { Book } from './Dashboard';
import '../styles/dashboard.css';

type BookListProps = {
    title: string;
    books: Book[];
    selectedBooks: number[];
    loading: boolean;
    onBookSelection: (bookId: number) => void;
    renderBookInfo?: (book: Book) => React.ReactNode;
  };
  
  const BookList: React.FC<BookListProps> = ({ title, books, selectedBooks, loading, onBookSelection, renderBookInfo }) => {
    return (
      <div className='book-list-container'>
        <h2>{title}</h2>
        <div className="book-list-content">
          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="book-list">
              <ul>
                {books.map((book) => (
                  <li key={book.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => onBookSelection(book.id)}
                      />
                      <div className="custom-checkbox"></div>
                      <span className="book-info">
                        {renderBookInfo ? renderBookInfo(book) : `${book.title} by ${book.author}`}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default BookList;