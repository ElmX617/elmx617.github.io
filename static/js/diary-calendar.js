(() => {
  "use strict";
  const pad = value => String(value).padStart(2, "0");
  const key = (year, month, day) => `${year}-${pad(month + 1)}-${pad(day)}`;
  const parts = date => date.split("-").map(Number);
  // Calendar days follow the site's configured timezone, including near midnight.
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const todayPart = type => Number(today.find(part => part.type === type).value);
  const todayKey = key(todayPart("year"), todayPart("month") - 1, todayPart("day"));

  document.querySelectorAll("[data-diary-calendar]").forEach(root => {
    const entries = JSON.parse(root.querySelector("[data-calendar-entries]").textContent);
    const byDate = new Map();
    entries.forEach(entry => {
      if (!byDate.has(entry.date)) byDate.set(entry.date, []);
      byDate.get(entry.date).push(entry);
    });
    const find = selector => root.querySelector(selector);
    let year = todayPart("year"), month = todayPart("month") - 1, selected = todayKey;
    const requested = new URLSearchParams(location.search).get("date");
    if (requested && /^\d{4}-\d{2}-\d{2}$/.test(requested)) {
      const [y, m, d] = parts(requested);
      const check = new Date(y, m - 1, d);
      if (y >= 1900 && y <= 9999 && check.getFullYear() === y && check.getMonth() === m - 1 && check.getDate() === d) {
        year = y; month = m - 1; selected = requested;
      }
    }

    function renderEntries() {
      const [y, m, d] = parts(selected);
      find("[data-selected-date]").textContent = `${y} 年 ${m} 月 ${d} 日`;
      const panel = find("[data-day-entries]");
      panel.replaceChildren();
      const daily = byDate.get(selected) || [];
      if (!daily.length) {
        const title = document.createElement("h3");
        title.textContent = "这一天，还没有记录。";
        const hint = document.createElement("p");
        hint.className = "diary-empty-note";
        hint.textContent = "平凡的一天，也可以值得被记住。点击有圆点的日期，回看写下的日子。";
        panel.append(title, hint);
      }
      daily.forEach(entry => {
        const link = document.createElement("a");
        link.href = entry.url; link.className = "diary-entry";
        const title = document.createElement("h3"); title.textContent = entry.title;
        link.append(title);
        if (entry.description) {
          const desc = document.createElement("p"); desc.textContent = entry.description; link.append(desc);
        }
        const read = document.createElement("span"); read.textContent = "读这篇日记 →";
        link.append(read); panel.append(link);
      });
    }

    function renderMonth() {
      find("[data-month-label]").textContent = `${year} 年 ${month + 1} 月`;
      find("[data-month-input]").value = `${year}-${pad(month + 1)}`;
      find("[data-prev]").disabled = year === 1900 && month === 0;
      find("[data-next]").disabled = year === 9999 && month === 11;
      const grid = find("[data-days]"); grid.replaceChildren();
      const offset = (new Date(year, month, 1).getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      for (let blank = 0; blank < offset; blank++) {
        const space = document.createElement("span"); space.setAttribute("aria-hidden", "true"); grid.append(space);
      }
      let writtenDays = 0, count = 0;
      for (let day = 1; day <= days; day++) {
        const date = key(year, month, day);
        const daily = byDate.get(date) || [];
        if (daily.length) { writtenDays++; count += daily.length; }
        const button = document.createElement("button");
        button.type = "button"; button.textContent = day; button.dataset.date = date;
        button.className = "diary-day";
        button.classList.toggle("has-entries", daily.length > 0);
        button.classList.toggle("is-today", date === todayKey);
        button.classList.toggle("is-selected", date === selected);
        button.setAttribute("aria-pressed", String(date === selected));
        button.setAttribute("aria-label", `${year}年${month + 1}月${day}日，${daily.length ? `有${daily.length}篇日记` : "没有日记"}`);
        if (date === todayKey) button.setAttribute("aria-current", "date");
        if (daily.length) {
          const dot = document.createElement("span"); dot.className = "diary-dot"; dot.setAttribute("aria-hidden", "true"); button.append(dot);
        }
        button.addEventListener("click", () => {
          selected = date;
          grid.querySelectorAll("button").forEach(item => {
            item.classList.toggle("is-selected", item.dataset.date === date);
            item.setAttribute("aria-pressed", String(item.dataset.date === date));
          });
          renderEntries();
        });
        grid.append(button);
      }
      find("[data-month-summary]").textContent = `这个月，${writtenDays} 天留下了 ${count} 篇日记。`;
      renderEntries();
    }
    function changeMonth(nextYear, nextMonth) {
      const next = new Date(nextYear, nextMonth, 1);
      if (next.getFullYear() < 1900 || next.getFullYear() > 9999) return;
      year = next.getFullYear(); month = next.getMonth();
      const prefix = `${year}-${pad(month + 1)}-`;
      selected = todayKey.startsWith(prefix) ? todayKey : entries.find(entry => entry.date.startsWith(prefix))?.date || `${prefix}01`;
      renderMonth();
    }
    find("[data-prev]").addEventListener("click", () => changeMonth(year, month - 1));
    find("[data-next]").addEventListener("click", () => changeMonth(year, month + 1));
    find("[data-today]").addEventListener("click", () => changeMonth(todayPart("year"), todayPart("month") - 1));
    find("[data-month-input]").addEventListener("change", event => {
      if (/^\d{4}-\d{2}$/.test(event.target.value)) {
        const [y, m] = parts(event.target.value);
        if (y >= 1900 && y <= 9999 && m >= 1 && m <= 12) changeMonth(y, m - 1);
      }
    });
    renderMonth();
  });
})();
