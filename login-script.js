//sinup----------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // Regex pattern for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let addUserForm = document.getElementById("sign-up-form");

  addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let emailInput = document.getElementById("email-input-sign-up").value;
    let firstNameInput = document.getElementById("firstName-input-sign-up").value;
    let lastNameInput = document.getElementById("lastName-input-sign-up").value;
    let passwordInput = document.getElementById("password-input-sign-up").value;

    // Check email format
    if (!emailRegex.test(emailInput)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid Email Format!",
      });
      return;
    }

    // Check if email already exists
    let checkEmail = async function() {
      const response = await fetch(`http://localhost:3000/users`);
      const data = await response.json();
      let emailExists = data.some(element => element.email === emailInput);
      
      if (emailExists) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "This Email is already used!",
        });
        document.getElementById("email-input-sign-up").value = emailInput;
      } else {
        let newUser = {
          "active": false,
          "firstName": firstNameInput,
          "lastName": lastNameInput,
          "email": emailInput,
          "password": passwordInput
        };
        fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        })
        .then(response => {
          if (response.ok) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "User Added Successfully",
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to add user",
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          alert("An error occurred");
        });
      }
    }

    checkEmail();
  });

  let signInForm = document.getElementById("sign-in-form");

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let emailInput = document.getElementById("email-sign-in-input").value;
    let passwordInput = document.getElementById("password-input-sign-in").value;
    let errorMessage = document.getElementById("error-message");

    // Validate email format
    if (!emailRegex.test(emailInput)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid Email Format!",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      let userFound = false;

      for (let element of data) {
        if (element.email === emailInput && element.password === passwordInput) {
          userFound = true;
          await fetch(`http://localhost:3000/users/${element.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: true })
          });
        } else {
          await fetch(`http://localhost:3000/users/${element.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ active: false })
          });
        }
      }
      if (!userFound) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email or Password!",
        });
        emailInput.value = "";
        passwordInput.value = "";
      } else {
        window.location.href = "homebage.html";
      }
    } catch (error) {
      console.error('Error:', error);
      errorMessage.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  });
});


//home page wilcome message------------------------------------------------


async function displayWelcomeMessage() {
  try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();

      data.forEach(user => {
          if (user.active == true) {
              
              const h1Tag = document.getElementById('welcome-user'); 
              h1Tag.textContent = '';
              h1Tag.textContent = `Welcome ${user.firstName} ${user.lastName}`;

          }
      })
  } catch {
      console.log(`User with name '${userName}' not found.`);
  }
};
displayWelcomeMessage()


async function displayInformation() {
  try {
      const response = await fetch('http://localhost:3000/users/');
      const data = await response.json();

      data.forEach(user => {
        if (user.active == true) {

          const pTag = document.getElementById('displayFirstName');
          pTag.textContent = `First Name: ${user.firstName}`;
  
          const p2Tag = document.getElementById('displayLastName');
          p2Tag.textContent = `Last Name: ${user.lastName}`;
        }
      });
  } catch (error) {
      console.log('Error fetching or displaying user information:', error);
  }
}

displayInformation();

async function populateEditForm(userId) {
  const user = await fetchUser(userId);
  if (user) {
      document.getElementById('firstNameInput').value = user.firstName;
      document.getElementById('lastNameInput').value = user.lastName;
  } else {
      alert('User not found or error fetching data.');
  }
}


document.getElementById('editForm').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const userId = 'fd78'; 
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;

  const patchData = {
      firstName: firstName,
      lastName: lastName
  };

  fetch(`http://localhost:3000/users/${userId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchData),
  })
  .then(response => response.json())
  .then(updatedUser => {
      console.log('Updated User:', updatedUser);
  })
  .catch(error => {
      console.error('Error updating user:', error);
  });
});
