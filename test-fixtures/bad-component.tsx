// Test file with intentional inclusion issues
// Use this to verify the plugin catches problems

import React from 'react';

// ❌ Language issues
const whitelist = ['admin', 'user']; // Should be allowlist
const masterConfig = { slave: 'replica-1' }; // Should be primary/replica

/**
 * Hey guys, this component handles user registration.
 * It's super simple - just click the button and you're done!
 * Even your grandma could use this.
 */
export function UserRegistrationForm() {
  // ❌ Hardcoded date format (US-only)
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // ❌ Binary gender, required field
  const genderOptions = ['Male', 'Female'];

  // ❌ Western-only test data
  const sampleUsers = [
    { firstName: 'John', lastName: 'Smith', email: 'john@example.com' },
    { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
    { firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' },
  ];

  return (
    <form>
      {/* ❌ Fixed width that won't accommodate text expansion */}
      <div style={{ width: '200px' }}>
        {/* ❌ Assumes Western name format */}
        <label>First Name *</label>
        <input name="firstName" required />

        <label>Last Name *</label>
        <input name="lastName" required />

        {/* ❌ Binary gender, required */}
        <label>Gender *</label>
        <select name="gender" required>
          {genderOptions.map(g => <option key={g}>{g}</option>)}
        </select>

        {/* ❌ Assumes marriage */}
        <label>Spouse's Name</label>
        <input name="spouseName" />

        {/* ❌ US-centric address */}
        <label>Street Address *</label>
        <input name="street" required />

        <label>City *</label>
        <input name="city" required />

        <label>State *</label>
        <input name="state" required />

        <label>ZIP Code *</label>
        <input name="zipCode" required pattern="[0-9]{5}" />

        {/* ❌ Assumes credit card access */}
        <label>Credit Card Number *</label>
        <input name="creditCard" required />

        {/* ❌ Ability-assuming language, no keyboard support */}
        <button
          onClick={() => console.log('submitted')}
          style={{ textAlign: 'left' }} // ❌ LTR assumption
        >
          Click here to submit
        </button>
      </div>

      {/* ❌ Color-only error indicator */}
      <span style={{ color: 'red' }}>Error occurred</span>
    </form>
  );
}

// ❌ Cultural assumptions in example
const christmasPromo = {
  title: "Christmas Sale!",
  description: "Order your holiday hamburgers now!",
  discount: "$20 off", // Hardcoded currency
};

// ❌ Sanity check function name
function sanityCheck(data: unknown) {
  if (!data) {
    // ❌ Ableist language
    throw new Error("This is crazy - data cannot be null!");
  }
  return true;
}

// ❌ Grandfathered pricing
const pricingTiers = {
  standard: 10,
  grandfathered: 5, // Should be "legacy"
};

export default UserRegistrationForm;
