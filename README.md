<div align="center">
  <a href="https://sendit-9i5p.onrender.com">
    <img src="public/send_icon.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Sendit</h3>
  <p align="center">
    Prosta aplikacja do komunikowania się za pomocą czatu.
  </p>
</div>

## O projekcie

[![Zdjęcie strony głównej](public/sendit_main_page.png)](https://sendit-9i5p.onrender.com)

Aplikacja umożliwia:
* Tworzenie czatów grupowych
* Pisanie w czatach indywidualnych i grupowych
* Zarządzaniem użytkownikami w czacie 

### Zbudowana za pomocą

Lista najważniejszych frameworków/bibliotek, którymi została zbudowana aplikacja.

* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
* ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
* ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
* ![React Zustand](https://img.shields.io/badge/react%20zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

### Instalacja

1. Pobranie wymaganych bibliotek.

```sh
   npm install
```

2. Utworznie projektu firebase. [Tutaj](https://console.firebase.google.com/) możesz go utworzyć.

3. W zakładce `Build` włączyć `Authentication` z logowaniem za pomocą emailu i hasła, `Firestore Database`, a następnie w `Rules` zmienić ostatnie `false` na `true` oraz `Storage`, a następnie w `Rules` zmienić ostatnie `false` na `true`.

4. Stwórz plik `.env`, wklej do niego zawartość pliku `.example.env`, a następnie ze uzupełnij go danymi ze wcześniej utworzonego projektu firebase.

5. Wystartowanie serwera.

```sh
   npm run dev
```



