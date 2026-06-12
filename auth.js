// ===== AUTH HELPERS (inclus sur toutes les pages) =====

// Met a jour le lien compte dans la navbar selon l'etat de connexion
function initAuthNav() {
  auth.onAuthStateChanged(user => {
    const link = document.getElementById('accountNavLink');
    if (!link) return;
    if (user) {
      link.textContent = 'Mon compte';
      link.href = 'compte.html';
    } else {
      link.textContent = 'Connexion';
      link.href = 'login.html';
    }
  });
}

// Sauvegarde une commande dans Firestore + attribue tickets concours
async function saveOrderToFirestore(orderData) {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userRef = db.collection('users').doc(user.uid);
    const itemsCount = orderData.items.reduce((s, i) => s + i.qty, 0);

    const orderPayload = {
      ...orderData,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      uid: user.uid,
      status: 'pending',
    };

    // Ajoute dans le profil utilisateur
    await userRef.collection('orders').add(orderPayload);

    // Ajoute aussi dans la collection globale pour l'admin dashboard
    await db.collection('orders').add(orderPayload);

    // Met a jour le compteur de fidelite
    await userRef.set({
      email: user.email,
      totalPuffsBought: firebase.firestore.FieldValue.increment(itemsCount),
    }, { merge: true });

    // Attribue les tickets du concours en cours (1 ticket / 2 puffs)
    const ticketsEarned = Math.floor(itemsCount / 2);
    if (ticketsEarned > 0) {
      const contestSnap = await db.collection('contests')
        .where('active', '==', true)
        .limit(1)
        .get();
      if (!contestSnap.empty) {
        const contestId = contestSnap.docs[0].id;
        await userRef.collection('contestTickets').doc(contestId).set({
          tickets: firebase.firestore.FieldValue.increment(ticketsEarned),
          snap: orderData.snap || '',
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    }

  } catch (err) {
    console.warn('Erreur sauvegarde commande:', err);
  }
}

// Calcul fidelite
function getLoyaltyStatus(totalBought) {
  const progress  = totalBought % 5;
  const freePuffs = Math.floor(totalBought / 5);
  return { progress, freePuffs, toNext: 5 - progress };
}

document.addEventListener('DOMContentLoaded', initAuthNav);
