document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Mobile Menu Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.innerHTML = navMenu.classList.contains('active') ? '&#10005;' : '&#9776;';
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '&#9776;';
      });
    });
  }

  // =========================================================================
  // 2. Header Scroll Effect
  // =========================================================================
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 3. Copy Account Number Functionality (for multiple cards)
  // =========================================================================
  window.copyAccountNumber = (elementId, btnElement) => {
    const numSpan = document.getElementById(elementId);
    if (!numSpan) return;
    const textToCopy = numSpan.textContent.trim();
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        btnElement.textContent = 'Copied!';
        btnElement.classList.add('copied');
        
        setTimeout(() => {
          btnElement.textContent = 'Copy';
          btnElement.classList.remove('copied');
        }, 2500);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        btnElement.textContent = 'Copied!';
        btnElement.classList.add('copied');
        setTimeout(() => {
          btnElement.textContent = 'Copy';
          btnElement.classList.remove('copied');
        }, 2500);
      });
  };

  // =========================================================================
  // 4. Donation Impact Calculator
  // =========================================================================
  const amountButtons = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('custom-amount');
  const impactDisplay = document.getElementById('impact-display');

  const getImpactDescription = (amount) => {
    if (isNaN(amount) || amount <= 0) {
      return "Please enter a valid donation amount to see its impact.";
    }
    
    if (amount < 5000) {
      return "A warm contribution supporting logistics and essential coordination for our local projects.";
    } else if (amount >= 5000 && amount < 100000) {
      const count = Math.floor(amount / 5000);
      return `Sponsors approximately ${count} food pack${count > 1 ? 's' : ''} or child holiday celebration pack${count > 1 ? 's' : ''} in Nembe!`;
    } else if (amount >= 100000 && amount < 130000) {
      const studentCount = Math.floor(amount / 100000);
      return `Sponsors academic scholarship & supplies for ${studentCount} student${studentCount > 1 ? 's' : ''} in Nembe!`;
    } else if (amount >= 130000 && amount < 250000) {
      const wheelchairCount = Math.floor(amount / 130000);
      return `Sponsors ${wheelchairCount} high-quality, durable wheelchair${wheelchairCount > 1 ? 's' : ''} to restore complete mobility and dignity!`;
    } else {
      const grantCount = Math.floor(amount / 250000);
      const remainder = amount % 250000;
      let text = `Sponsors ${grantCount} micro-empowerment grant${grantCount > 1 ? 's' : ''} of 250,000 NGN to help widows and youth start self-sustaining trade businesses!`;
      if (remainder >= 130000) {
        text += ` Plus ${Math.floor(remainder / 130000)} wheelchair(s) for mobility support!`;
      } else if (remainder >= 100000) {
        text += ` Plus academic scholarship support for a student!`;
      } else if (remainder >= 5000) {
        text += ` Plus ${Math.floor(remainder / 5000)} food pack(s)!`;
      }
      return text;
    }
  };

  const updateImpact = (amount) => {
    impactDisplay.textContent = getImpactDescription(amount);
  };

  amountButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active classes
      amountButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class
      button.classList.add('active');
      // Reset custom input
      if (customAmountInput) customAmountInput.value = '';
      
      const amount = parseInt(button.getAttribute('data-amount'), 10);
      updateImpact(amount);
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      // Remove active classes from buttons
      amountButtons.forEach(btn => btn.classList.remove('active'));
      
      const amount = parseInt(customAmountInput.value, 10);
      updateImpact(amount);
    });
  }



  // =========================================================================
  // 6. Supporter Wall of Hope (localStorage support)
  // =========================================================================
  const supporterForm = document.getElementById('supporter-form');
  const supportersWall = document.getElementById('supporters-wall');

  const defaultMessages = [
    { name: "Chief Michael O.", msg: "Let us bring joy to the hearts of our people in Nembe this December. Proud to support!", date: "2026-06-25" },
    { name: "Ambassador Clara T.", msg: "A wonderful initiative that has consistently brought hope. God bless the Kalango Foundation.", date: "2026-06-24" },
    { name: "Pastor David B.", msg: "Giving wheelchairs to the disabled is a gift of freedom. Highly recommend donating!", date: "2026-06-23" },
    { name: "Tari E. (Student)", msg: "The educational support changes lives. Thank you Kalango Foundation for helping us study.", date: "2026-06-20" }
  ];

  const getSupporters = () => {
    const stored = localStorage.getItem('kalango_supporters');
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem('kalango_supporters', JSON.stringify(defaultMessages));
    return defaultMessages;
  };

  const renderSupporters = () => {
    if (!supportersWall) return;
    supportersWall.innerHTML = '';
    const supporters = getSupporters();

    // Sort by date, newest first
    supporters.sort((a, b) => new Date(b.date) - new Date(a.date));

    supporters.forEach(supporter => {
      const card = document.createElement('div');
      card.className = 'message-card';
      
      const formattedDate = new Date(supporter.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      card.innerHTML = `
        <p class="msg-text">"${escapeHtml(supporter.msg)}"</p>
        <div class="msg-footer">
          <span class="msg-author">${escapeHtml(supporter.name)}</span>
          <span>${formattedDate}</span>
        </div>
      `;
      supportersWall.appendChild(card);
    });
  };

  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  };

  if (supporterForm) {
    supporterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('sup-name');
      const messageInput = document.getElementById('sup-message');

      if (nameInput.value.trim() && messageInput.value.trim()) {
        const newSupporter = {
          name: nameInput.value.trim(),
          msg: messageInput.value.trim(),
          date: new Date().toISOString().split('T')[0]
        };

        const supporters = getSupporters();
        supporters.push(newSupporter);
        localStorage.setItem('kalango_supporters', JSON.stringify(supporters));

        renderSupporters();

        // Reset fields
        nameInput.value = '';
        messageInput.value = '';

        // Alert user
        alert('Thank you! Your message of hope has been posted on the supporter wall.');
      }
    });
  }

  // =========================================================================
  // 7. Image Slideshow / Cycling (Cycles images every 2 minutes)
  // =========================================================================
  const slideshows = [
    {
      imgId: 'wheelchair-img',
      images: ['assets/wheelchair_1.jpg', 'assets/wheelchair_2.jpg', 'assets/wheelchair_3.jpg']
    },
    {
      imgId: 'food-img',
      images: ['assets/food_1.jpg', 'assets/food_2.jpg', 'assets/food_3.jpg']
    },
    {
      imgId: 'party-img',
      images: ['assets/party_1.jpg', 'assets/party_2.jpg', 'assets/party_3.jpg']
    },
    {
      imgId: 'scholarship-img',
      images: ['assets/scholarship_1.jpg', 'assets/scholarship_2.jpg', 'assets/scholarship_3.jpg']
    }
  ];

  slideshows.forEach(slide => {
    const imgEl = document.getElementById(slide.imgId);
    if (!imgEl) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * slide.images.length);
      } while (newIndex === currentIndex);
      
      currentIndex = newIndex;
      
      // Smooth fade transition
      imgEl.style.transition = 'opacity 0.5s ease';
      imgEl.style.opacity = 0;
      
      setTimeout(() => {
        imgEl.src = slide.images[currentIndex];
        imgEl.style.opacity = 1;
      }, 500);
    }, 120000); // 2 minutes
  });

  // Initial render
  renderSupporters();
});
