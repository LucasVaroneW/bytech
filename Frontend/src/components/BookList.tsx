import React, { useState } from 'react';
import axios from 'axios';
import { Book } from './Dashboard';
import '../styles/dashboard.css';
import ModalForm from './ModalForm';

type BookListProps = {
  title: string;
  books: Book[];
  selectedBooks: number[];
  loading: boolean;
  onBookSelection: (bookId: number) => void;
  renderBookInfo?: (book: Book) => React.ReactNode;
  inputSearch: boolean;
  onSuccess?: () => void;
  onError?: () => void;
};
  
  const BookList: React.FC<BookListProps> = ({ title, books, selectedBooks, loading, onBookSelection, renderBookInfo, inputSearch, onSuccess, onError }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectEditBook, setSelectEditBook] = useState<Book | null>(null);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    };
  
    const filteredBooks = inputSearch
      ? books.filter((book) =>
          `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : books;


    const handleOpenModal = (book: Book) => {
      setSelectEditBook(book);
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
    };

    const handleDelete = async(book: Book) =>{
      try{
        await axios.delete(`http://localhost:3000/api/book/deleteBook/${book.id}`);
        setSelectEditBook(null);
        onSuccess && onSuccess();
      } catch(error){
        console.error('Error deleting the book', error);
        onError && onError();
      }
  
    }

    return (
      <div className='book-list-container'>
        <div className='book-list-title'>
          <div className='book-list-title-text'>
            <h2>{title}</h2>
          </div>
          {inputSearch && (
            <div className="search-box">
              <button className="btn-search"><i className="fas fa-search"></i></button>
              <input type="text" className="input-search" value={searchQuery} onChange={handleSearchChange} placeholder="Search books..." />
            </div>
          )}
        </div>
        <div className="book-list-content">
          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="book-list">
              <ul>
                {filteredBooks.map((book) => (
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
                      <div className='actions'>
                        <button className='action-icon' onClick={() => handleOpenModal(book)}>
                          <i className='fas fa-edit'></i>
                        </button>
                        <button className='action-icon' onClick={() => handleDelete(book)}>
                          <i className='fas fa-trash'></i>
                        </button>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <ModalForm 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isEditMode={true}
          editBookData={selectEditBook}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    );
  };
  
  export default BookList;