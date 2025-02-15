function loadUserProfile() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const userData = JSON.parse(atob(token));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.id === userData.userId);

    if (user) {
      document.getElementById("userName").textContent = user.username;
      document.getElementById("userEmail").textContent = user.email;
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  }
}

// Back Button Function
function goBack() {
  window.history.back();
}

// Profile Picture Upload
document
  .getElementById("uploadImage")
  .addEventListener("change", function (event) {
    const reader = new FileReader();
    reader.onload = function () {
      document.getElementById("profileImg").src = reader.result;
      // Save profile picture to localStorage
      localStorage.setItem(`profilePic_${getUserId()}`, reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  });

function getUserId() {
  const token = localStorage.getItem("authToken");
  if (token) {
    const userData = JSON.parse(atob(token));
    return userData.userId;
  }
  return null;
}

// Load profile picture on page load
function loadProfilePicture() {
  const userId = getUserId();
  if (userId) {
    const profilePic = localStorage.getItem(`profilePic_${userId}`);
    if (profilePic) {
      document.getElementById("profileImg").src = profilePic;
    }
  }
}

// Initialize profile page
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadProfilePicture();
});

// Add Emergency Contact
function addContact() {
  const name = document.getElementById("newContactName").value;
  const number = document.getElementById("newContactNumber").value;

  if (name && number) {
    const contactList = document.getElementById("contactList");
    const newContact = document.createElement("li");
    newContact.innerHTML = `${name}: <a href="tel:${number}">${number}</a>`;
    contactList.appendChild(newContact);

    // Clear input fields
    document.getElementById("newContactName").value = "";
    document.getElementById("newContactNumber").value = "";
  } else {
    alert("Please enter both name and number.");
  }
}

// Add this after the existing event listeners
document.getElementById("logoutBtn").addEventListener("click", function () {
  // Clear authentication token
  localStorage.removeItem("authToken");
  // Clear profile picture
  localStorage.removeItem(`profilePic_${getUserId()}`);
  // Redirect to login page
  window.location.href = "login.html";
});
