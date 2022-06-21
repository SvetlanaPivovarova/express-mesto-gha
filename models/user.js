const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);

//{
//  "name": тестовый пользователь,
//  "about": информация о себе,
//  "avatar": https://lh3.googleusercontent.com/ogw/ADea4I7C2J0Pl8rorSWA4GfxnBU97UXNNonSGvbgjSpdWg=s32-c-mo,
//  }