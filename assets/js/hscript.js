// Recruit button action
document.getElementById("recruit-btn").addEventListener("click", () => {
  // For now, redirect to a form/discord invite
  // Replace with your actual link
  window.location.href = "https://discord.gg/3c8uVbsG";
});



document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // hide all panels
      panels.forEach(p => p.style.display = "none");
      buttons.forEach(b => b.classList.remove("active"));

      // show selected panel
      document.getElementById(btn.dataset.target).style.display = "flex";
      btn.classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".tab-btn1");
  const panels = document.querySelectorAll(".tab-panel1");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // hide all panels
      panels.forEach(p => p.style.display = "none");
      buttons.forEach(b => b.classList.remove("active"));

      // show selected panel
      document.getElementById(btn.dataset.target).style.display = "block";
      btn.classList.add("active");
    });
  });
});


fetch(`${API_BASE}/clan/2L0QRVR2V`) 
    .then(res => res.json())
    .then(data => {

      if (data.badgeUrls) {

          const badge = document.getElementById("clanBadge");
          badge.src = data.badgeUrls.small;
          badge.alt = "Clan Badge";
    }
      // Clan right section
      document.getElementById("clanLeague").textContent = data.warLeague?.name || "N/A";
      document.getElementById("totalPoints").textContent = `${data.clanPoints} 🏆 | ${data.clanBuilderBasePoints} ⚔️`;
      document.getElementById("clanLocation").textContent = data.location?.name || "International";
      document.getElementById("chatLanguage").textContent = data.chatLanguage?.name || "N/A";
      document.getElementById("clanType").textContent = data.type || "N/A";
      document.getElementById("requiredTrophies").textContent = `${data.requiredTrophies } 🏆`;
      document.getElementById("requiredTH").textContent = data.requiredTownhallLevel || "N/A";
      
      // Stats section
      document.getElementById("warsPlayed").textContent = data.warWins + data.warTies + data.warLosses || 0;
      document.getElementById("warsWon").textContent = data.warWins || 0;
      document.getElementById("warWinStreak").textContent = data.warWinStreak || 0;
      document.getElementById("clanLeague").textContent = data.warLeague?.name || "N/A";
      document.getElementById("warFrequency").textContent = data.warFrequency || "N/A";




      // find leader from memberList
  fetch("http://localhost:5000/clan/2L0QRVR2V/members")
        .then(res => res.json())
        .then(membersData => {
          const leader = membersData.items.find(m => m.role === "leader");
          document.getElementById("clanLeader").textContent = leader ? leader.name : "N/A";
        });


      // Clan Capital Stats
      document.getElementById("capitalHall").textContent = data.clanCapital?.capitalHallLevel || "N/A";
      document.getElementById("capitalUpgrades").textContent = data.clanCapital?.totalCapitalPoints || "N/A";
      document.getElementById("raidLogs").textContent = data.isWarLogPublic ? "Available" : "Private";
      document.getElementById("capitalLeague").textContent = data.capitalLeague?.name || "N/A";
      document.getElementById("capitalTrophies").textContent = data.clanCapitalPoints || "N/A";
    })
    .catch(err => console.error("Error fetching clan data:", err));


async function loadCurrentWar(tag) {
  try {
    const res = await fetch(`${API_BASE}/clan/${tag}/currentwar`);
    const data = await res.json();

    // --- War Info ---
    let state = data.state;

    if (state === "inWar") {
      document.getElementById("war-state").innerText = "In War";
    } else if (state === "warEnded") {
      document.getElementById("war-state").innerText = "War Ended";
    } else if (state === "preparation") {
      document.getElementById("war-state").innerText = "Preparation Day";
    } else {
      document.getElementById("war-state").innerText = state; // fallback
    }
    document.getElementById("team-size").innerText = `${data.teamSize} vs ${data.teamSize}`;
    document.getElementById("time-remaining").innerText = formatTimeRemaining(data.endTime);



    // --- My Clan ---
    document.getElementById("my-clan-name").innerText = data.clan.name;
    document.getElementById("my-stars").innerText = data.clan.stars + " ⭐";
    document.getElementById("my-destruction").innerText = data.clan.destructionPercentage.toFixed(2) + " %";
    document.getElementById("M-level").innerText = data.clan.clanLevel;
    document.querySelector(".mine .clan-badge").src = data.clan.badgeUrls.small;

    // --- Opponent Clan ---
    document.getElementById("opponent-name").innerText = data.opponent.name;
    document.getElementById("opponent-stars").innerText = data.opponent.stars + " ⭐" ;
    document.getElementById("opponent-destruction").innerText = data.opponent.destructionPercentage.toFixed(2) + " %";
    document.getElementById("opponent-level").innerText = data.opponent.clanLevel;
    document.querySelector(".opponent .clan-badge").src = data.opponent.badgeUrls.small;

    // --- Time Remaining ---

  } catch (err) {
    console.error("Error fetching current war:", err);
    document.getElementById("war-state").innerText = "Error loading";
  }
}

loadCurrentWar("2L0QRVR2V"); 


async function loadRaidInfo(tag) {
  try {
    const res = await fetch(`API_BASE:5000/clan/${tag}/capitalraidseasons`);
    const data = await res.json();
    const raid = data.items[0]; 

    // --- War / Raid Info ---
    let state = raid.state;

    if (state === "ongoing") {
      document.getElementById("raid-state").innerText = "Raid Active";
    } else if (state === "RaidEnded") {
      document.getElementById("raid-state").innerText = "Raid Ended";
    } else {
      document.getElementById("raid-state").innerText = state; // fallback
    } 

    document.getElementById("time-remaining1").innerText = formatTimeRemaining(raid.endTime);

    // --- My Clan ---
    document.getElementById("my-clan-name").innerText = raid.clanName || "My Clan";
    document.getElementById("totalAttacks").innerText = raid.totalAttacks;
    document.getElementById("raidsCompleted").innerText = raid.raidsCompleted;
    document.getElementById("capitalTotalLoot").innerText = raid.capitalTotalLoot;
    document.getElementById("rewards").innerText = `${raid.offensiveReward} from attacks + ${raid.defensiveReward} from defenses`;

    // Best attacker
    const best = raid.members.reduce((a, b) =>
      a.capitalResourcesLooted > b.capitalResourcesLooted ? a : b
    );
    document.getElementById("best-attacker").innerText =
      " " + best.name + ` (${best.capitalResourcesLooted})`;

    // --- Clan badge (if backend sends it) ---
    if (raid.clanBadge) {
      document.querySelector(".mine .clan-badge").src = raid.clanBadge;
      
    }

  } catch (err) {
    console.error("Error fetching raid info:", err);
    document.getElementById("war-state").innerText = "Error loading";
  }
}

loadRaidInfo("2L0QRVR2V");


// Helper: calculate remaining time
function updateTime(start, end) {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  let diff, text = "";

  if (now < startDate) {
    diff = startDate - now;
    text = "War starts in ";
  } else if (now < endDate) {
    diff = endDate - now;
    text = "War ends in ";
  } else {
    document.getElementById("time-remaining").innerText = "War Ended";
    return;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("time-remaining").innerText =
    `${text}${hours}h ${mins}m ${secs}s`;

  // Update every second
  setTimeout(() => updateTime(start, end), 1000);
}


// Helper: format remaining time
function formatTimeRemaining(endTime) {
  // CoC API time format: "YYYYMMDDTHHmmss.SSSZ"
  // Example: 20250829T070000.000Z
  const year = endTime.substring(0, 4);
  const month = endTime.substring(4, 6);
  const day = endTime.substring(6, 8);
  const hour = endTime.substring(9, 11);
  const minute = endTime.substring(11, 13);
  const second = endTime.substring(13, 15);

  // Convert to valid ISO string
  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  const end = new Date(isoString);
  const now = new Date();

  let diff = end - now;
  if (diff < 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${mins}m`;
}


