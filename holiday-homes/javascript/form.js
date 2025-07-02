
/* Opens the popup booking form */
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

/* Closes the popup booking form */
function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

/* Wait for the DOM to load */
$(document).ready(function () {
  console.log("jQuery is working!");

  /* Intercept form submission and validate data before allowing it
     Ref: https://www.w3schools.com/jquery/event_preventdefault.asp*/
  $('#booking-request').submit(function (e) {
    e.preventDefault();
    let errors = [];


	/* Retrieve and trim user inputs using jQuery .val() and .trim() 
	Reference:https://www.w3schools.com/jquery/html_val.asp
	Reference: https://www.w3schools.com/jsref/jsref_trim_string.asp */
    let firstName = $('#first_name').val().trim();
    let lastName = $('#last_name').val().trim();
    let adults = parseInt($('#adults').val().trim());
    let kids = parseInt($('#kids').val().trim());
    let checkIn = $('#Check_in').val().trim();
    let checkOut = $('#Check_out').val().trim();
    let email = $('#email').val().trim();
    let phone = $('#phone').val().trim();
    let message = $('#message').val().trim();
    let terms = $('#terms').is(':checked');
    let bedroom = $('input[name="bedroom_choice"]:checked').attr('id'); 
    let bedroomSelected = !!bedroom;

    /* Basic required field checks something is filled in */
    if (!firstName) errors.push("First name is required.");
	if (!lastName) errors.push("Last name is required.");

    /* Validate names using regex (letters only)
	Reference: https://regexr.com/ */	
	const pattern = /^[a-zA-Z]+$/;
	if (firstName && !pattern.test(firstName)) {
		errors.push("First name cannot contain numbers or special characters.");
	}
	if (lastName && !pattern.test(lastName)) {
		errors.push("Last name cannot contain numbers or special characters.");
	}
	
	 /* Checking if at least 1 adult is selected */
    if (adults === 0) errors.push("At least one adult must be selected.");
	
	 /* Basic required field checks something is filled in */
    if (!checkIn) errors.push("Check-in date is required.");
    if (!checkOut) errors.push("Check-out date is required.");
    if (!email) errors.push("Email is required.");
    else if (!validateEmail(email)) errors.push("Email format is invalid.");
    if (!phone) errors.push("Phone number is required.");
    else if (!validatePhone(phone)) errors.push("Phone number must include country code and contain digits only.");
    if (!bedroomSelected) errors.push("Please select a bedroom option.");
    if (!terms) errors.push("You must agree to the terms and conditions.");


     /* Validate date logic using JavaScript Date objects
     Ref: https://www.w3schools.com/jsref/jsref_obj_date.asp */
    if (checkIn && checkOut) {
      const today = new Date();
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate <= today) {
        errors.push("Check-in date must be after today.");
      }

      if (checkOutDate <= checkInDate) {
        errors.push("Check-out date must be after check-in date.");
      }
    }

     /* Validate number of guests based on room selection */
    const totalPeople = adults + kids;
    if (bedroom === "one_bedroom" && totalPeople > 3) {
      errors.push("1-bedroom homes allow max 3 guests.");
    }
    if (bedroom === "two_bedroom" && totalPeople > 6) {
      errors.push("2-bedroom homes allow max 6 guests.");
    }
    if (bedroom === "three_bedroom" && totalPeople > 8) {
      errors.push("3-bedroom homes allow max 8 guests.");
    }

     /* Display error messages if any were found */
    if (errors.length > 0) {
      let errorList = "<strong>Error(s):</strong><ul>";
        errors.forEach(function (err) {
        errorList += "<li>" + err + "</li>";
        });
        errorList += "</ul>";

        $('#error-box').html(errorList).hide().slideDown();
        document.getElementById("error-box").scrollIntoView({ behavior: "smooth" });
		
     /* If no errors, hide error box, Reset form inputs, Close form give alert message we will contact you within 48 hours. */		
    } else {
		$('#error-box').slideUp();
		alert("Your request has been send succesfully! You'll hear from us within 48 hours.");
		$('#booking-request')[0].reset();
		document.getElementById("myForm").style.display = "none";  // Close the popup
		window.location.href = "bookings.html"; 	  
    }
  });

/* Email validation using a simple regex pattern */
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
 /* Phone number validation: must start with + and have 6 to 15 digits */
  function validatePhone(phone) {
    const regex = /^\+\d{9,15}$/; 
    return regex.test(phone);
  }
});
