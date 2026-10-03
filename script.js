/**
 * Opération commerciale Dakar 2 - Interactions & Demandes de services
 * Kiréne avec Orange / Orange Money
 */

(function () {
  'use strict';

  const WHATSAPP_PHONE = '221782759999';

  // Répertoire des tarifs et conditions par service
  const SERVICES_DATA = {
    'Numéro commercial Kiréne avec Orange': {
      price: '10 000 FCFA',
      condition: '—'
    },
    'Ouverture compte Orange Money': {
      price: 'GRATUIT',
      condition: '500 FCFA de premier dépôt obligatoire'
    },
    'Déplafonnement compte Orange Money': {
      price: 'GRATUIT',
      condition: 'Carte d’identité obligatoire'
    },
    'Déblocage compte Orange Money': {
      price: 'GRATUIT',
      condition: 'Carte d’identité obligatoire'
    },
    'Acheter SIM Kiréne avec Orange': {
      price: '500 FCFA',
      condition: 'Carte d’identité obligatoire'
    },
    'Récupération numéro Kiréne avec Orange': {
      price: '1 000 FCFA',
      condition: 'Carte d’identité obligatoire'
    },
    'Identification numéro de téléphone': {
      price: '500 FCFA',
      condition: 'Carte d’identité obligatoire'
    },
    'Demande eSIM Kiréne avec Orange': {
      price: '500 FCFA',
      condition: 'Carte d’identité obligatoire'
    },
    'Service clients OPC Dakar 2': {
      price: 'GRATUIT',
      condition: 'Orientation et assistance immédiate'
    }
  };

  // Éléments du DOM
  const modal = document.getElementById('serviceModal');
  const serviceSelect = document.getElementById('serviceSelect');
  const modalServicePrice = document.getElementById('modalServicePrice');
  const modalServiceCondition = document.getElementById('modalServiceCondition');
  const clientNameInput = document.getElementById('clientName');
  const clientPhoneInput = document.getElementById('clientPhone');
  const clientNameError = document.getElementById('clientNameError');
  const clientPhoneError = document.getElementById('clientPhoneError');
  const orderForm = document.getElementById('serviceOrderForm');
  const closeBtn = document.getElementById('closeModalBtn');
  const serviceCards = document.querySelectorAll('.service[data-service]');

  let lastActiveElement = null;

  /**
   * Met à jour l'encadré tarif & condition affiché dans le modal avant le formulaire
   */
  function updatePricingDisplay(serviceName) {
    const data = SERVICES_DATA[serviceName] || {
      price: 'Tarif sur demande',
      condition: 'Selon conditions applicables'
    };

    if (modalServicePrice) {
      modalServicePrice.textContent = data.price;
      if (data.price === 'GRATUIT') {
        modalServicePrice.classList.add('is-free');
      } else {
        modalServicePrice.classList.remove('is-free');
      }
    }

    if (modalServiceCondition) {
      modalServiceCondition.textContent = data.condition;
    }
  }

  /**
   * Ouvre la modale de demande avec le service pré-sélectionné
   */
  function openServiceModal(serviceName) {
    lastActiveElement = document.activeElement;

    // Normalisation si besoin
    if (serviceSelect) {
      if (serviceName && SERVICES_DATA[serviceName]) {
        serviceSelect.value = serviceName;
      } else if (serviceName) {
        // Recherche partielle au cas où
        for (const key of Object.keys(SERVICES_DATA)) {
          if (key.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(key.toLowerCase())) {
            serviceSelect.value = key;
            serviceName = key;
            break;
          }
        }
      }

      updatePricingDisplay(serviceSelect.value);
    }

    // Réinitialiser les erreurs
    clearErrors();

    // Afficher la modale
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus sur le champ nom après l'animation
    setTimeout(function () {
      if (clientNameInput) {
        clientNameInput.focus();
      }
    }, 120);
  }

  /**
   * Ferme la modale de demande
   */
  function closeServiceModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    clearErrors();

    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  /**
   * Efface les messages d'erreurs
   */
  function clearErrors() {
    if (clientNameError) {
      clientNameError.textContent = '';
      clientNameError.classList.remove('active');
    }
    if (clientPhoneError) {
      clientPhoneError.textContent = '';
      clientPhoneError.classList.remove('active');
    }
    if (clientNameInput) {
      clientNameInput.classList.remove('has-error');
    }
    if (clientPhoneInput) {
      clientPhoneInput.classList.remove('has-error');
    }
  }

  /**
   * Met à jour l'affichage lorsque l'utilisateur change de service dans le select
   */
  if (serviceSelect) {
    serviceSelect.addEventListener('change', function () {
      updatePricingDisplay(serviceSelect.value);
    });
  }

  // Écoute des clics sur chaque carte de service
  serviceCards.forEach(function (card) {
    const serviceName = card.getAttribute('data-service') || card.querySelector('h3')?.textContent.trim();

    card.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('tel:')) {
        return;
      }
      e.preventDefault();
      openServiceModal(serviceName);
    });

    // Accessibilité au clavier : Touche Entrée ou Espace
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openServiceModal(serviceName);
      }
    });
  });

  // Fermeture bouton
  if (closeBtn) {
    closeBtn.addEventListener('click', closeServiceModal);
  }

  // Fermeture clic sur le fond sombre (backdrop)
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeServiceModal();
      }
    });
  }

  // Fermeture touche Echap (Escape)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeServiceModal();
    }
  });

  // Nettoyage des erreurs à la frappe
  if (clientNameInput) {
    clientNameInput.addEventListener('input', function () {
      if (clientNameInput.value.trim().length > 0) {
        clientNameError.textContent = '';
        clientNameError.classList.remove('active');
        clientNameInput.classList.remove('has-error');
      }
    });
  }

  if (clientPhoneInput) {
    clientPhoneInput.addEventListener('input', function () {
      if (clientPhoneInput.value.trim().length >= 4) {
        clientPhoneError.textContent = '';
        clientPhoneError.classList.remove('active');
        clientPhoneInput.classList.remove('has-error');
      }
    });
  }

  // Soumission du formulaire -> Envoi WhatsApp vers +221782759999 avec Tarif et Condition
  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      const service = serviceSelect ? serviceSelect.value.trim() : 'Service OPC Dakar 2';
      const clientName = clientNameInput ? clientNameInput.value.trim() : '';
      const clientPhone = clientPhoneInput ? clientPhoneInput.value.trim() : '';

      let hasError = false;

      if (!clientName) {
        if (clientNameError && clientNameInput) {
          clientNameError.textContent = 'Veuillez saisir votre nom et prénom.';
          clientNameError.classList.add('active');
          clientNameInput.classList.add('has-error');
          clientNameInput.focus();
        }
        hasError = true;
      }

      if (!clientPhone) {
        if (clientPhoneError && clientPhoneInput) {
          clientPhoneError.textContent = 'Veuillez renseigner votre numéro de téléphone.';
          clientPhoneError.classList.add('active');
          clientPhoneInput.classList.add('has-error');
          if (!hasError) clientPhoneInput.focus();
        }
        hasError = true;
      }

      if (hasError) {
        return;
      }

      // Récupérer le tarif et la condition du service sélectionné
      const details = SERVICES_DATA[service] || { price: 'Non précisé', condition: '—' };

      // Construction du message WhatsApp avec tarif et conditions clairs
      const message = [
        'Bonjour Opération commerciale Dakar 2,',
        'Je souhaite effectuer une demande de service :',
        '',
        '📌 Service : ' + service,
        '💰 Tarif : ' + details.price,
        '📋 Condition : ' + details.condition,
        '',
        '👤 Nom du client : ' + clientName,
        '📞 Téléphone : ' + clientPhone,
        '',
        'Merci de prendre en charge ma demande.'
      ].join('\n');

      const waUrl = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(message);

      // Ouvrir WhatsApp dans un nouvel onglet
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // Feedback visuel sur le bouton
      const submitBtn = document.getElementById('submitWhatsappBtn');
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Redirection WhatsApp en cours...</span>';

        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;
          closeServiceModal();
        }, 1800);
      }
    });
  }

  // Initialisation par défaut de l'affichage du tarif
  if (serviceSelect) {
    updatePricingDisplay(serviceSelect.value);
  }

  // Exposer les fonctions si besoin
  window.openServiceModal = openServiceModal;
  window.closeServiceModal = closeServiceModal;
})();
