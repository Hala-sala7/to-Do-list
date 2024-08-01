"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useAuth } from "@firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { db } from "@firebase/firebase";
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button, Checkbox, Container, IconButton, TextField, Typography, Box } from '@mui/material';
import "./globals.css";

const Home = () => {
  const [todo, setTodo] = useState("");  // State to hold the new todo item
  const [allTodos, setAllTodos] = useState([]);  // State to hold all todos

  const router = useRouter();
  const { authUser, isLoading, HandleSignOut } = useAuth();

  // Effect to redirect user to login if not authenticated and fetch todos if authenticated
  useEffect(() => {
    if (authUser) {
      fetchTodos(authUser.uid);
    } else {
      router.push("/login");
    }
  }, [authUser, isLoading, router]);

  // Handle logout and redirect to login page
  const handleLogoutClick = () => {
    HandleSignOut();
    router.push("/login");
  };

  // Handle change in the input field for new todo item
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  // Add a new todo to Firestore
  const addTodo = async () => {
    try {
      if (todo.length > 0) {
        await addDoc(collection(db, "todos"), {
          content: todo,
          completed: false,
          owner: authUser.uid,
        });
      }
      fetchTodos(authUser.uid);
      setTodo("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // Fetch todos from Firestore for the authenticated user
  const fetchTodos = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));
      const data = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setAllTodos(data);
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
  };

  // Delete a todo from Firestore
  const deleteTodoItem = async (uid) => {
    try {
      await deleteDoc(doc(db, "todos", uid));
      fetchTodos(authUser.uid);
    } catch (err) {
      console.log("Error deleting document:", err);
    }
  };

  // Update the completion status of a todo in Firestore
  const handleUpdateChange = async (e, uid) => {
    try {
      const item = doc(db, "todos", uid);
      await updateDoc(item, {
        completed: e.target.checked,
      });
      fetchTodos(authUser.uid);
    } catch (err) {
      console.log("Error updating document:", err);
    }
  };

  return !authUser ? (
    <Loading />  // Show loading component if user is not authenticated
  ) : (
    <Container maxWidth="md" className="relative min-h-screen">
      <Box mt={4} textAlign="center">
        <Typography variant="h3">📝</Typography>
        <Typography variant="h4" fontWeight="bold">ToDoList</Typography>
      </Box>
      <Box mt={4} display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`👋 Hello ${authUser?.name}, What to do Today?`}
          value={todo}
          onChange={handleChange}
          sx={{ 
            backgroundColor: '#fff', 
            borderRadius: 1, 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            fontSize: '1.25rem', // Increase font size
            padding: '12px', // Increase padding
          }}
          inputProps={{
            style: { padding: '12px' } // Increase padding for the input element
          }}
        />
        <IconButton 
          color="primary" 
          onClick={addTodo}
          sx={{
            backgroundColor: '#f0f0f0', 
            '&:hover': { 
              backgroundColor: '#e0e0e0' 
            }
          }}
        >
          <AiOutlinePlus size={30} />
        </IconButton>
      </Box>
      <Box mt={4}>
        {allTodos.length > 0 &&
          allTodos.map((todo) => (
            <Box 
              key={todo.id} 
              display="flex" 
              justifyContent="space-between" 
              mt={2} 
              alignItems="center" 
              className="todo-item"
              sx={{ 
                backgroundColor: '#fff', 
                borderRadius: 1, 
                padding: 2, 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
              }}
            >
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={todo.completed}
                  onChange={(e) => handleUpdateChange(e, todo.id)}
                  sx={{ 
                    '&.Mui-checked': {
                      color: '#4caf50',
                    }
                  }}
                />
                <Typography 
                  variant="body1" 
                  className={todo.completed ? "line-through" : ""}
                  sx={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none', 
                    color: todo.completed ? '#888' : '#000' 
                  }}
                >
                  {todo.content}
                </Typography>
              </Box>
              <IconButton 
                color="error" 
                onClick={() => deleteTodoItem(todo.id)}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#ffe6e6' 
                  } 
                }}
              >
                <MdDeleteForever size={24} />
              </IconButton>
            </Box>
          ))}
      </Box>
      <Box className="fixed bottom-5 right-5">
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handleLogoutClick} 
          startIcon={<GoSignOut />}
          sx={{ 
            backgroundColor: '#f44336', 
            '&:hover': { 
              backgroundColor: '#d32f2f' 
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
