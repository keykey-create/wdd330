export default class Alert {
  constructor() {
    this.path = "/json/alerts.json";
  }

  async init() {
    // read the alerts from the json file
    const alerts = await this.getAlerts();

    // if there are no alerts, do nothing
    if (alerts.length === 0) {
      return;
    }

    // build the section and put it at the top of the main element
    const section = this.buildAlertList(alerts);
    document.querySelector("main").prepend(section);
  }

  async getAlerts() {
    const response = await fetch(this.path);
    if (!response.ok) {
      throw new Error("Bad Response");
    }
    return await response.json();
  }

  buildAlertList(alerts) {
    const section = document.createElement("section");
    section.classList.add("alert-list");

    // one <p> for each alert
    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color;
      section.appendChild(p);
    });

    return section;
  }
}
