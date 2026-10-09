/*
 * DepoTrack - Etapa 2: logica pe date
 * Conform ghidului, acest fisier nu modifica interfata si nu foloseste document.
 */

const TIPURI_PRODUSE = ["materie-prima", "produs-finit", "consumabil"];

const produse = [
    { id: 1, nume: "Șuruburi M8", stoc: 0, disponibil: false, tip: "materie-prima", categorie: "Hardware", utilizator: "admin" },
    { id: 2, nume: "Cutii de carton", stoc: 5, disponibil: false, tip: "consumabil", categorie: "Ambalaje", utilizator: "admin" },
    { id: 3, nume: "Motoare electrice", stoc: 3, disponibil: true, tip: "produs-finit", categorie: "Electronice", utilizator: "admin" },
     { id: 4, nume: "Ulei de motor", stoc: 6, disponibil: false, tip: "consumabil", categorie: "Ambalaje", utilizator: "admin" },
];

// Disponibilitatea este determinata de cantitatea din stoc.
function actualizeazaDisponibilitate(lista) {
    return lista.map((produs) => ({ ...produs, disponibil: produs.stoc > 0 }));
}

// 1. Listarea numelor produselor.
function listeazaProduse(lista) {
    return lista.map((produs) => produs.nume);
}

// 2. Numararea produselor cu stoc mai mare decat zero.
function numaraDisponibile(lista) {
    return lista.filter((produs) => produs.stoc > 0).length;
}

// 3. Cautarea dupa nume, fara diferenta intre litere mari si mici.
function cautaProduse(lista, text) {
    const cautat = text.trim().toLowerCase();
    if (cautat === "") return [];
    return lista.filter((produs) => produs.nume.toLowerCase().includes(cautat));
}

// ID-ul nou este maximul existent + 1, inclusiv dupa stergerea unui produs.
function nextId(lista) {
    return lista.reduce((maxim, produs) => Math.max(maxim, produs.id), 0) + 1;
}

// 4. Adaugare cu validare; lista primita nu este modificata.
function adaugaProdus(lista, nume, stoc, tip = "materie-prima", categorie = "Hardware", utilizator = "admin") {
    const numeCurat = typeof nume === "string" ? nume.trim() : "";
    const cantitate = Number(stoc);

    if (numeCurat === "") {
        console.log("Eroare: numele produsului nu poate fi gol.");
        return lista;
    }
    if (stoc === "" || !Number.isFinite(cantitate) || !Number.isInteger(cantitate) || cantitate < 0) {
        console.log("Eroare: stocul trebuie sa fie un numar intreg mai mare sau egal cu 0.");
        return lista;
    }
    if (!TIPURI_PRODUSE.includes(tip)) {
        console.log("Eroare: tipul produsului nu este valid.");
        return lista;
    }

    const produsNou = {
        id: nextId(lista),
        nume: numeCurat,
        stoc: cantitate,
        disponibil: cantitate > 0,
        tip,
        categorie,
        utilizator
    };
    return [...lista, produsNou];
}

// 5. Modificarea stocului unui produs, cu actualizarea disponibilitatii.
function modificaStoc(lista, id, stocNou) {
    const cantitate = Number(stocNou);
    if (stocNou === "" || !Number.isFinite(cantitate) || !Number.isInteger(cantitate) || cantitate < 0) {
        console.log("Eroare: stocul trebuie sa fie un numar intreg mai mare sau egal cu 0.");
        return lista;
    }

    return lista.map((produs) => produs.id === id
        ? { ...produs, stoc: cantitate, disponibil: cantitate > 0 }
        : produs
    );
}
function afiseazaProduse(){
    const container = document.getElementById("lista-produse");

    if(!container){
        console.error("Nu exista elementul cu id-ul 'lista-produse' in DOM.");
    return;}
    container.innerHTML = ""; // Golim containerul înainte de a adăuga produsele

    produse.forEach(function(produs) {
        const card= document.createElement("article")
        card.className = "produs_card";
        card.innerHTML = `
         <h3>$  
        `;
        container.appendChild(card);
    }
}
}
// 6. Stergerea unui produs dupa ID.
function stergeProdus(lista, id) {
    return lista.filter((produs) => produs.id !== id);
}

// Teste manuale grupate pe sectiuni, afisate in consola browserului.
console.log("--- Citire ---");
console.log("Produse:", listeazaProduse(produse).join(", "));
console.log("Produse disponibile:", numaraDisponibile(produse));
console.log("Cautare 'suruburi':", listeazaProduse(cautaProduse(produse, "suruburi")).join(", "));

console.log("--- Adaugare ---");
let listaTest = adaugaProdus(produse, "Rulmenti 6204", 12, "materie-prima");
console.log("Lista noua:", listaTest.length, "produse");
console.log("Lista initiala a ramas cu:", produse.length, "produse");

console.log("--- Modificare stoc si stergere ---");
listaTest = modificaStoc(listaTest, 1, 5);
console.log("Stoc Șuruburi M8 dupa modificare:", listaTest.find((p) => p.id === 1).stoc);
console.log("Produse disponibile dupa modificare:", numaraDisponibile(listaTest));
listaTest = stergeProdus(listaTest, 3);
console.log("Dupa stergerea ID-ului 3:", listeazaProduse(listaTest).join(", "));

console.log("--- Validare ---");
adaugaProdus(listaTest, "   ", 5);
adaugaProdus(listaTest, "Produs invalid", -2);
adaugaProdus(listaTest, "Alt produs", 2, "tip-invalid");