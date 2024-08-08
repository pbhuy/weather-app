import './assets/styles/app.scss';

function App() {
  return (
    <>
      <div className="container">
        <h1>Weather Forecast Notifications</h1>

        <form id="subscribeForm">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" required />

          <label htmlFor="city">City:</label>
          <input type="text" id="city" required />

          <label htmlFor="frequency">Notification Frequency:</label>
          <select id="frequency">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>

          <button type="submit">Subscribe</button>
        </form>

        <div id="message" className="message"></div>

        <form id="unsubscribeForm">
          <h2>Unsubscribe</h2>
          <label htmlFor="unsubEmail">Email:</label>
          <input type="email" id="unsubEmail" required />

          <button type="submit">Unsubscribe</button>
        </form>
      </div>
    </>
  );
}

export default App;
