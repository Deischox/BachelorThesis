<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Deischox/Online_Meeting_Analytic_Website">
    <img src="images/uhh-logo.png" alt="Logo" width="253" height="114">
  </a>

<h3 align="center">Platform to aid the data collection for Online Meeting Analytics</h3>

  <p align="center">
    Bachelor Thesis at the University of Hamburg by Silas Ueberschaer
    <br />
    <a href="https://github.com/Deischox/Online_Meeting_Analytic_Website"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Deischox/Online_Meeting_Analytic_Website">View Demo</a>
    ·
    <a href="https://github.com/Deischox/Online_Meeting_Analytic_Website/issues">Report Bug</a>
    ·
    <a href="https://github.com/Deischox/Online_Meeting_Analytic_Website/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

- [Node.js](https://nodejs.dev/)
- [React.js](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [mui](https://mui.com/)
- [SurveyJS](https://surveyjs.io/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Download and install [Node.js](https://nodejs.dev/).

Install latest version of npm.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Install all dependencies for the server

- npm
  ```sh
  cd server
  npm i
  ```
  or
- yarn
  ```sh
  cd server
  yarn i
  ```

2. Install all dependencies for the client

- npm
  ```sh
  cd client
  npm i
  ```
  or
- yarn
  ```sh
  cd client
  yarn i
  ```

3. edit .env for client

```js
REACT_APP_API_BASE=
REACT_APP_SOCKET_IO_BASE=
REACT_APP_WEBSITE=
REACT_APP_INTERVIEW_TIME=
```

4. edit .env for server

```js
MONGO_URI=
HTTPS=
REACT_URL=
```

5. edit Makefile

```js
SSH_STRING_SERVER:=user@ip
```

6. Change the [consent](https://github.com/Deischox/Online_Meeting_Analytic_Website/blob/master/client/src/utils/files/text.json) text file
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Deployment

1. clone repository

```js
git clone https://github.com/Deischox/BachelorThesis.git
```

2. inside the repository, copy all files to the server

```js
sudo make copy-files
```

3. ssh into the server

```js
sudo make ssh
```

4. place the ssh-certificates into the client folder

5. change Caddyfile URL

```js
URL {
    tls cert.pem key.pem

    handle_path /* {
        root * /srv
        try_files {path} {path} /index.html
        file_server
    }

    handle_path /api/* {
        reverse_proxy  api-server:5000
    }
}
```

5. build and run docker container

```js
sudo make build-production
```

```js
sudo make run-production
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Your Name - [@Silasueber](https://twitter.com/Silasueber) - silas.ueberschaer@gmx.de

Project Link: [https://github.com/Deischox/Online_Meeting_Analytic_Website](https://github.com/Deischox/Online_Meeting_Analytic_Website)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/Deischox/Online_Meeting_Analytic_Website.svg?style=for-the-badge
[contributors-url]: https://github.com/Deischox/Online_Meeting_Analytic_Website/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Deischox/Online_Meeting_Analytic_Website.svg?style=for-the-badge
[forks-url]: https://github.com/Deischox/Online_Meeting_Analytic_Website/network/members
[stars-shield]: https://img.shields.io/github/stars/Deischox/Online_Meeting_Analytic_Website.svg?style=for-the-badge
[stars-url]: https://github.com/Deischox/Online_Meeting_Analytic_Website/stargazers
[issues-shield]: https://img.shields.io/github/issues/Deischox/Online_Meeting_Analytic_Website.svg?style=for-the-badge
[issues-url]: https://github.com/Deischox/Online_Meeting_Analytic_Website/issues
[license-shield]: https://img.shields.io/github/license/Deischox/Online_Meeting_Analytic_Website.svg?style=for-the-badge
[license-url]: https://github.com/Deischox/Online_Meeting_Analytic_Website/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/BachelorProjectScreenshot.png
