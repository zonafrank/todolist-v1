function getDate() {
  const today = new Date();
  const options = {
    day: "numeric",
    weekday: "long",
    month: "long",
  };

  return today.toLocaleDateString("en-UK", options);
}

function getDay() {
  const today = new Date();
  const options = {
    weekday: "long",
  };

  return today.toLocaleDateString("en-UK", options);
}

module.exports = { getDate, getDay };
