//import jsonwebtoken
const jwt = require('jsonwebtoken')

// import db.js
const db = require('./db')
// db = { 
//     1000: {"acno": 1000, "username": "athu", "password": 1000, "balance": 5000,transaction:[] },
//     1001: { "acno": 1001, "username": "ammu", "password": 1001, "balance": 5000,transaction:[] },
//     1002: { "acno": 1002, "username": "anu", "password": 1002, "balance": 5000,transaction:[] }
//   }
//register

var register = (username, acno, password) => {
  var amount=parseInt(amt)
  return db.User.findOne({
    acno
  }).then(user => {
    console.log(user);
    if (user) {
      return {
        status: false,
        messege: "already registered...please login",
        statusCode: 401
      }
    }
    else {
      const newUser = new db.User({
        acno,
        password,
        username,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
        status: true,
        messege: "register successfully",
        statusCode: 200

      }
    }

  })
}

//login
const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno
      //token generation
      token = jwt.sign({
        //store account number inside token
        currentAcno: acno
      }, 'supersecretkey12345')
      return {
        status: true,
        messege: "login successfully",
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }

    }
    else {
      return {
        status: false,
        messege: "invalid account number or password",
        statusCode: 401

      }

    }
  })

}

//deposit

const deposit = (acno, password, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno, password
  }).then(user => {
    if (user) {
      user.balance += amount
      user.transaction.push({
        type: "credit",
        amount: amount
      })
      user.save()
      return {
        status: true,
        messege: amount + "deposited successfully..new balance is" + user.balance,
        statusCode: 200

      }

    }
    else {
      return {
        status: false,
        messege: "invalid account number or password",
        statusCode: 401

      }

    }

  })

}
//withdraw

const withdraw = (acno, password, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno, password
  }).then(user => {
    if (user) {
      if (user.balance > amount) {
        user.balance -= amount
        user.transaction.push({
          type: "debit",
          amount: amount
        })
        user.save()
        return {
          status: true,
          messege: amount + "debitted successfully..new balance is" + user.balance,
          statusCode: 200

        }

      }

      else {
        return {
          status: false,
          messege: "insufficient balance",
          statusCode: 401

        }

      }
    }
    else {
      return {
        status: true,
        messege: "incorrect password or account number",
        statusCode: 422

      }

    }

  })
}

//transaction
const getTransaction = (acno) => {
  return db.User.findOne({
    acno
  }).then(user=>{
    if(user)
    {
      return {
        status: true,
        statusCode: 200,
        transaction: user.transaction

      }

    }
    else {
      return {
        status: false,
        messege: "use doesnot exist......",
        statusCode: 401

      }

    }

  })

  }


//export

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
}


