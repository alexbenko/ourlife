# laughing-winner
[![LinkedIn][linkedin-shield]][linkedin-url]


# PROJECT IS WIP
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">FullStack-Typescript-Template</h3>

<!-- TABLE OF CONTENTS -->
<details open="open">
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
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

I personally love Nodejs. It is a powerful language with a lot of amazing features, online support, and a myriad of packages via NPM to speed up development time. But there are diffculties scaling due to Javscript being dynamically typed.  I am super passionate about backend development and I feel a Nodejs and Typescript backend is super powerful. I am creating this tempalate to benefit my future projects, show my backend skills to potential employers, and help anyone who wants to use this to speed up their development. This template has a variety of features and implementations.

This project is no where near what I want it to be able to do
## To Do List:
* <strike> Custom logging that saves logs to their own files when in production envioronment to replace console.log(). </strike>
* <strike> Cronjob that uploads the logs to a cloud storage (Possibly Google Drive or AWS S3) and then clears out the log directory to prevent filling up server. </strike>
* <strike> Ip Blacklister - saves the ips of malicious attackers in Redis and a request validator that 404s that ip when they try to make another request. </strike>
* React Front End Set Up - Webpack, babel, robots.txt
* Honeypot endpoints - save the ip of any request to these endpoints and ban them
* Log Critical Errors to a slack channel
* Full Test Suite
* CI with Github actions/docker
* Full User Authentication
* Automatic HTTPS set up
* <strike> Bash script that backs up postgresql and cron job that uploads the backup to S3 </strike>
* Bash script that backs up redis and cron job that uploads the backup to S3
* Bash script that ensures proper packages for server are installed

A list of commonly used resources that I find helpful are listed in the acknowledgements.

### Built With

* [Nodejs](https://nodejs.org)
* [Typescript](https://www.typescriptlang.org/docs/)
* [Express](https://expressjs.com/)
* [Redis](https://github.com/NodeRedis/node-redis)
* [Postgres](https://www.postgresql.org/docs/13/index.html)



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites
1. Clone The Repository
   ```sh
   git clone https://github.com/alexbenko/Backend-Typescript-Template.git
   ```
    or using Github Cli
    ```sh
    gh repo clone alexbenko/FullStack-Typescript-Template
    ```
    
This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. You need to set up the following enviornment variables in order for the server to start. The names are self explanitory for what they are used for.
```sh
  ENVIRONMENT=
  AWS_ACCESS_KEY=
  AWS_SECRET_ACCESS_KEY=
  S3_BUCKET_NAME=projecttiny
  PG_USER=
  PG_PASSWORD=
```
3. 
4. Install NPM packages
   ```sh
   npm install
   ```



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the GNU General Public License v3.0 License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

Your Name - [@your_twitter](https://twitter.com/your_username) - email@example.com

Project Link: [https://github.com/your_username/repo_name](https://github.com/your_username/repo_name)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [README Template](https://github.com/othneildrew/Best-README-Template/blob/master/README.md)
* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/alexander-benko-06b99a1a4/
[product-screenshot]: images/screenshot.png
