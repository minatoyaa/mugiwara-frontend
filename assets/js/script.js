// Recruit button action
document.getElementById("recruit-btn").addEventListener("click", () => {

  window.location.href = "https://discord.gg/your-invite-link";
});


fetch("http://localhost:5000/clan/2L0QRVR2V") 
    .then(res => res.json())
    .then(data => {

      if (data.badgeUrls) {

          const badge = document.getElementById("clanBadge");
          badge.src = data.badgeUrls.small;
          badge.alt = "Clan Badge";
    }
    })
    .catch(err => console.error("Error fetching clan data:", err));
