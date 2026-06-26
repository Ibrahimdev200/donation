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
  // 3. Copy Account Number & Currency Tab Switching
  // =========================================================================
  const copyBtn = document.getElementById('copy-acc-btn');
  const accNumSpan = document.getElementById('acc-num');
  const currencyBtns = document.querySelectorAll('.currency-tab-btn');
  const currencyLabel = document.getElementById('currency-label');

  const bankAccounts = {
    ngn: { number: '2008211160', label: 'Account Number (Naira NGN)' },
    usd: { number: '2008306594', label: 'Account Number (US Dollar USD)' },
    gbp: { number: '2008315336', label: 'Account Number (Pound Sterling GBP)' }
  };

  if (currencyBtns.length > 0 && accNumSpan && currencyLabel) {
    currencyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const currency = btn.getAttribute('data-currency');
        const accInfo = bankAccounts[currency];

        accNumSpan.textContent = accInfo.number;
        currencyLabel.textContent = accInfo.label;
      });
    });
  }

  if (copyBtn && accNumSpan) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = accNumSpan.textContent.trim();
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2500);
        })
        .catch(err => {
          console.error('Failed to copy account number: ', err);
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2500);
        });
    });
  }

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
    
    if (amount < 3000) {
      return "A warm contribution supporting logistics and essential coordination for our local projects.";
    } else if (amount >= 3000 && amount < 5000) {
      return "Sponsors a complete festive holiday meal, party favors, and gift bags for 1 child at our Christmas and New Year gathering!";
    } else if (amount >= 5000 && amount < 15000) {
      return "Buys a family-sized food pack containing rice, beans, cooking oil, tomato paste, and spices, sustaining a needy family for the holidays.";
    } else if (amount >= 15000 && amount < 20000) {
      return "Sponsors three family food packs OR covers complete holiday clothes and shoes for two children in the community.";
    } else if (amount >= 20000 && amount < 50000) {
      return "Sponsors primary school tuition, textbooks, backpacks, and school uniform for one child's upcoming term in Nembe!";
    } else if (amount >= 50000 && amount < 75000) {
      return "Provides a micro-empowerment grant or essential business equipment (like a sewing machine or hair dryer) to help a widow start her own trade!";
    } else {
      const wheelchairCount = Math.floor(amount / 75000);
      const remainder = amount % 75000;
      
      let text = `Sponsors ${wheelchairCount} high-quality, durable wheelchair${wheelchairCount > 1 ? 's' : ''} to restore complete mobility and dignity to ${wheelchairCount > 1 ? 'disabled individuals' : 'a disabled person'} in Nembe!`;
      
      if (remainder >= 5000) {
        text += ` PLUS a family-sized food pack for local support!`;
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
  // 5. Past Projects Gallery Filters
  // =========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          // Force reflow for fade-in animations
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

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

  // Initial render
  renderSupporters();
});
