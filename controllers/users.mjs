import db from '../db/index.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt'

export const deleteUser = async (req, res, next) => {
  const { role, userId } = req.user
  const id = req.params.id
  try {
    await db.read()
    const user = db.data.users.find(u => u.id === id)
    const currentUser = db.data.users.find(u => u.id === user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (role === user.role) {
      return res.status(400).json({ message: 'not you delete yourself' })

    }
    if (role !== 'admin' && role !== 'superAdmin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (id === userId && role === 'admin') {
      return res.status(403).json({ error: 'Admin cannot delete themselves' });
    }
    if (id === userId && role === 'superAdmin') {
      return res.status(403).json({ error: 'SuperAdmin cannot delete themselves' });
    }
    // if (role === 'superAdmin' && user.role === 'admin') {
    //   return res.status(403).json({ error: 'SuperAdmin cannot delete an admin user' });
    // }
    if (role === 'admin' && user.role !== 'admin' || role === 'superAdmin' && user.role === 'admin') {

      const indexUser = db.data.users.indexOf(user)
      db.data.users.splice(indexUser, 1)
      await db.write()
      return res.json({ message: 'User deleted' });
    }

    return res.status(403).json({ error: 'Unauthorized' });

  } catch (error) {
    next(error)
  }
}



export const update = async (req, res, next) => {
  const { userId, role } = req.user
  const { password } = req.body
  try {
    await db.read()
    const user = db.data.users.find((user) => user.id === userId)
    if (!user) {
      return res.status(400)
    }
    if (!role === user.role) {
      return res.status(401).json({ message: "You are not in your role" })
    }
    const indexUser = db.data.users.indexOf(user)

    if (password) {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)

      db.data.users.splice(indexUser, 1, {
        ...user,
        ...req.body,
        password: hashPassword
      })
    }

    db.data.users.splice(indexUser, 1, {
      ...user, ...req.body
    })

    res.status(200).json({ message: 'User updated' })
    await db.write()

  } catch (error) {
    next(error)
  }
}

export const userMe = async (req, res, next) => {
  const { userId } = req.user
  try {
    await db.read()
    const user = db.data.users.filter(u => u.id === userId)
    if (!user) {
      return res.status(400)
    }
    res.status(200).json({ user })
    await db.write()

  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  const { role } = req.query
  try {
    await db.read()
    if (role === 'superAdmin') {
      return res.status(403).json({
        message: 'No access',
      });
    }

    const users = db.data.users.filter(u => u.role === role)

    await db.write()
    res.status(200).json({ users })
  } catch (error) {
    next(error)
  }
}
export const addAdmin = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    await db.read();

    const existingUser = db.data.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).send({ message: `User with username of ${email} already exist!` });
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    db.data.users.push({
      id: randomUUID(),
      password: hashPassword,
      firstName,
      lastName,
      email,
      role: 'admin',
    });
    await db.write();

    res.status(200).json({
      message: "Added",
    });
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    await db.read();
    const user = db.data.users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({
        message: 'Incorrect email or password',
      });
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400)
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, { expiresIn: '3h' });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { password, firstName, lastName, email } = req.body;

    await db.read();

    const existingUser = db.data.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).send({ message: `User with username of ${email} already exist!` });
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    db.data.users.push({
      id: randomUUID(),
      password: hashPassword,
      firstName,
      lastName,
      email,
      role: 'customer',
    });
    await db.write();

    res.status(200).json({
      message: "You have registered",
    });
  } catch (error) {
    next(error);
  }
};


