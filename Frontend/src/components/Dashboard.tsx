import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import '../styles/dashboard.css';
import BookList from './BookList';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalForm from './ModalForm';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
};

type Tab = {
  id: number;
  title: string;
};

const Dashboard: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [selectedUserBook, setSelectedUserBook] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>('');


  const toastOptions: ToastOptions = useMemo(() => ({
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      borderRadius: '15px',
      backgroundColor: '#d6e6f7',
      color: '#2c2b2bb4',
    },
  }), []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const tabsData: Tab[] = [
    { id: 1, title: 'Book List' },
    { id: 2, title: 'Profile' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Book[]>('http://localhost:3000/api/book/getBook');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssociatesUserBooks = useCallback(async () => {
    try {
      const response = await axios.get<Book[]>(`http://localhost:3000/api/user/${user?.id}/allBook`);
      setUserBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
  
    if (lastAction === 'success') {
      toast.success('Successful modification', toastOptions);
    }

    if (lastAction === 'error') {
      toast.error('Error when modifying', toastOptions);
    }

    setLastAction('');

    const fetchDataAndAssociations = async () => {
      try {
        setLoading(true);
        await fetchData();
        if (isMounted) {
          await getAssociatesUserBooks();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
  
    if (token) {
      fetchDataAndAssociations();
    }
  
    return () => {
      isMounted = false;
    };
  }, [token, getAssociatesUserBooks, lastAction, toastOptions]);

  const handleBookSelection = (bookId: number) => {
    setSelectedBooks((prevSelectedBooks) => {
      if (prevSelectedBooks.includes(bookId)) {
        return prevSelectedBooks.filter((id) => id !== bookId);
      } else {
        return [...prevSelectedBooks, bookId];
      }
    });
  };

  const handleAssociateBooks = async () => {
    try {
      const alreadyAssociatedBooks = selectedBooks.filter((bookId) =>
        userBooks.some((userBook) => userBook.id === bookId)
      );
  
      const newBooksToAssociate = selectedBooks.filter((bookId) =>
        !userBooks.some((userBook) => userBook.id === bookId)
      );
  
      if (alreadyAssociatedBooks.length > 0) {
        const bookTitles = alreadyAssociatedBooks.map(
          (bookId) => books.find((book) => book.id === bookId)?.title
        );
  
        toast.warn(`You already have the following books: ${bookTitles.join(', ')}`, toastOptions);
      }
  
      if (newBooksToAssociate.length > 0) {
        await Promise.all(
          newBooksToAssociate.map(async (bookId) => {
            await axios.post(`http://localhost:3000/api/user/${user?.id}/book/${bookId}`);
          })
        );
      }
  
      setSelectedBooks([]);
      getAssociatesUserBooks();
      fetchData();
  
      toast.success('Books associated successfully', toastOptions);
    } catch (error) {
      console.error('Error associating books:', error);
      toast.error('Error associating books', toastOptions);
    }
  };
  
  const handleModalSuccess = () => {
    setLastAction('success');
  };

  const handleModalError = () => {
    setLastAction('error');
  };

  const handleRowClick = (book: Book) => {
    setSelectedUserBook(book.id === selectedUserBook ? null : book.id);
  };

  const handleDeleteClick = async (book: Book) => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/user/delete/${user?.id}/book/${book.id}`);
        if (response.status === 200) {
          console.log(`Successfully deleted book with ID ${book.id}`);
          setSelectedUserBook(null);
          getAssociatesUserBooks();
          toast.success('Books deleted successfully', toastOptions);

        } else {
          console.error(`Failed to delete book with ID ${book.id}`);
          toast.error('Failed to delete book', toastOptions);
      }
  
      fetchData();
    } catch (error) {
      console.error('Error deleting books:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="tabs">
        {tabsData.map((tab) => (
          <React.Fragment key={tab.id}>
            <input
              type="radio"
              id={`tab${tab.id}`}
              name="tab"
              checked={activeTab === tab.id}
              onChange={() => setActiveTab(tab.id)}
            />
            <label htmlFor={`tab${tab.id}`}>{tab.title}</label>
          </React.Fragment>
        ))}
        <div className="marker">
          <div id="top"></div>
        </div>
      </div>

      <div className='tab-content'>
        {activeTab === 1 && (
          <>
            <div className='books-container'>
              <BookList
                title={'BOOKS:'}
                books={books}
                selectedBooks={selectedBooks}
                loading={loading}
                onBookSelection={handleBookSelection}
                inputSearch={true}
                onSuccess={handleModalSuccess}
                onError={handleModalError}
              />
              <div className='btn-container'>
                <button className='btn-add-book' onClick={handleOpenModal}>Add Book</button>
              </div>
            </div>
            <div className="selected-books-container">
              <BookList
                title={'SELECTED BOOKS:'}
                books={selectedBooks.map((bookId) => books.find((book) => book.id === bookId) || ({ id: -1, title: '', author: '', genre: '' }))}
                selectedBooks={selectedBooks}
                loading={loading}
                onBookSelection={handleBookSelection}
                inputSearch={false}
                renderBookInfo={(book) => (
                  <>
                    {book.title} by {book.author}
                  </>
                )}
              />
              <div className='btn-container'>
                <button className='btn-associate' onClick={handleAssociateBooks}>Associate</button>
              </div>
            </div>
          </>
        )}

        {activeTab === 2 && (
          <div className='profile-user-book-container'>
            <div className='profile-user-book-text'>
              <h2>USER BOOKS:</h2>
            </div>
            <div className='profile-user-book-content'>
              <table className='profile-user-book-list'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {userBooks.map((book) => (
                    <tr
                      key={book.id}
                      className={`profile-user-book ${book.id === selectedUserBook ? 'selected' : ''}`}
                      onClick={() => handleRowClick(book)}
                    >
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>
                        <button onClick={() => handleDeleteClick(book)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className='log-out' onClick={() => logout()}>Log Out</button>
          </div>
        
        )}
      </div>
      <ToastContainer />
      <ModalForm isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={handleModalSuccess} onError={handleModalError}/>
    </div>
  );
};

export default Dashboard;
