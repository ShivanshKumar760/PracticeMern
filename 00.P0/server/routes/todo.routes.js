import { Router } from "express";
import Todo from "../schema/TodoSchema";
import { authorization } from "../middleware/auth.js";
import {
  addTodo,
  deleteTodo,
  getAllTodo,
  perticularTodo,
  patchTodo,
} from "../controller/todo.controller.js";

const router = Router();
router.use(authorization);

router.get("/", authorization, getAllTodo);
router.post("/", authorization, addTodo);
router.get("/:id", authorization, perticularTodo);
// router.put("/:id", authorization);
router.delete("/:id", authorization, deleteTodo);
router.patch("/:id/toggle", authorization, patchTodo);
