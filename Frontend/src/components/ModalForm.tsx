import React, { FormEvent, useEffect, useState } from 'react'
import '../styles/modal.css';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { Book } from './Dashboard';

interface modalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    onError?: () => void;
    isEditMode?: boolean;
    editBookData?: Book | null;

}

const ModalForm: React.FC<modalProps> = ({isOpen, onClose, onSuccess, onError, isEditMode = false, editBookData}) => {
  const [bookName, setBookName] = useState<string>('');
  const [bookAuthor, setBookAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [httpMethod, setHttpMethod] = useState<string>('POST');

  useEffect(() => {

    if (isEditMode && editBookData) {
      setBookName(editBookData.title);
      setBookAuthor(editBookData.author);
      setGenre(editBookData.genre);
      setHttpMethod('PUT');
    }
  }, [isEditMode, editBookData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    let endpoint = 'http://localhost:3000/api/book/newBook';

    try {

      if (isEditMode && editBookData && editBookData?.id) {
        endpoint = `http://localhost:3000/api/book/updateBook/${editBookData.id}`;
        
      }

      const response = await axios({
        method: httpMethod,
        url: endpoint,
        data: {
          title: bookName,
          author: bookAuthor,
          genre: genre,
        },
      });

      if (response.data) {
        console.log(isEditMode ? 'Book updated successfully' : 'Book added successfully');
      }

      if (onSuccess) {
        onSuccess();
      }

      console.log(isEditMode ? 'Book updated successfully' : 'Book added successfully');
    } catch (error) {
      console.log('Error adding/editing the book', error);

      if (onError) {
        onError();
      }
    }

    onClose();
  };

  const handleGenreChange =  (event: React.ChangeEvent<HTMLSelectElement>) => {
      setGenre(event.target.value);
  };

  const genres = [
      "Fiction",
      "Magical Realism",
      "Classics",
      "Mystery",
      "Historical Fiction",
      "Epic Poetry",
      "Experimental",
      "Novel",
      "Novel",
      "Novel",
      "Short Stories",
      "Short Stories",
      "Magical Realism",
      "Historical",
      "Psychological Novel",
      "Gothic",
      "Dystopia",
      "Romance",
      "Classic",
      "Fiction",
      "Coming of Age",
      "Fantasy",
      "Dystopian",
      "Fantasy",
      "Thriller",
      "Philosophical Fiction",
      "Gothic Horror",
      "Young Adult",
      "Adventure",
      "Post-Apocalyptic",
      "Drama"
  ]
    
  return (
      <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="modal-close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className='modal-form-item'>
            <label htmlFor="bookName">Title:</label>
            <div className='modal-form-item-input'>
              <input
                type='text'
                id='bookName'
                name='bookName'
                placeholder='Insertar nombre del libro'
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
              />
            </div>
          </div>

          <div className='modal-form-item'>
            <label htmlFor="bookAuthor">Author:</label>
            <div className='modal-form-item-input'>
              <input
                type='text'
                id='bookAuthor'
                name='bookAuthor'
                placeholder='Insertar autor del libro'
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
              />
            </div>
          </div>

          <div className='modal-form-item'>
            <label htmlFor="genre">Genre:</label>
            <select
              id='genre'
              name='genre'
              value={genre}
              onChange={handleGenreChange}
            >
              {genres.map((genreOption, index) => (
                  <option key={index} value={genreOption.toLowerCase().replace(/\s/g, '-')}>
                  {genreOption}
                  </option>
              ))}
            </select>
          </div>

          <input type="submit" value={isEditMode ? "Edit Book" : "Add Book"} />
        </form>
      </div>
    </div>
  )
}

export default ModalForm