import Todo from "../schema/TodoSchema.js";
import User from "../schema/UserSchema.js";
import { authorization } from "../middleware/auth.js";

export const getAllTodo = async (req, res) => {
  const userId = req.user._id;
  try {
    const todos = await Todo.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
      err: err,
    });
  }
};

export const perticularTodo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req;
  const userId = _id;

  try {
    const todo = await Todo.findOne({
      _id: id,
      userId: userId,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      todo,
    });
  } catch (err) {
    console.error("Get todo error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching todo",
    });
  }
};

export const addTodo = (req, res) => {
  const { todoName } = req.body;

  if (!todoName || todoName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Todo name is required",
    });
  }

  const newTodo = new Todo({
    todoName: todoName.trim(),
    userId: req.user._id,
  });

  newTodo
    .save()
    .then((savedTodo) => {
      res.status(201).json({
        success: true,
        message: "Todo created successfully",
        todo: savedTodo,
      });
    })
    .catch((error) => {
      console.error("Create todo error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating todo",
      });
    });
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting todo",
    });
  }
};

export const patchTodo = (req, res) => {
  const { todoName, isCompleted } = req.body;

  Todo.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: "Todo not found",
        });
      }

      // Update fields if provided
      if (todoName !== undefined) {
        if (todoName.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Todo name cannot be empty",
          });
        }
        todo.todoName = todoName.trim();
      }

      if (isCompleted !== undefined) {
        todo.isCompleted = isCompleted;
      }

      return todo.save();
    })
    .then((updatedTodo) => {
      if (!updatedTodo) return; // Handle case where todo wasn't found

      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        todo: updatedTodo,
      });
    })
    .catch((error) => {
      console.error("Update todo error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating todo",
      });
    });
};
