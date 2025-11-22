export default class Alert {
  constructor(parentSelector, url = "/json/alerts.json") {
    this.parent = document.querySelector(parentSelector);
    this.url = url;
  }

  async init() {
    if (!this.parent) return;

    const alerts = await this.getAlerts();
    if (!alerts || !alerts.length) return;

    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach((alert) => {
      const p = document.createElement("p");
      p.textContent = alert.message;
      p.style.backgroundColor = alert.background;
      p.style.color = alert.color || "white";
      section.appendChild(p);
    });

    this.parent.prepend(section);
  }

  async getAlerts() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error("Error loading alerts:", error);
      return [];
    }
  }
}
