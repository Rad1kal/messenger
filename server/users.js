const { trimStr } = require("./utils");

let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find(
    (usr) => trimStr(usr.name) === userName && trimStr(usr.room) === userRoom
  );
};

const addUser = (user) => {
  const isExist = findUser(user);

  if (!isExist) users.push(user);

  const currentUser = isExist || user;

  return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => users.filter((u) => u.room === room);

const removeUser = (user) => {
  const found = findUser(user);

  if (found) {
    users = users.filter(
      ({ room, name }) => room === found.room && name !== found.name
    );
  }

  return found;
};

module.exports = { addUser, findUser, getRoomUsers, removeUser };
