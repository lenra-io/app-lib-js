<div id="top"></div>
<!--
*** This README was created with https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">App Lib for javaScript based projects</h3>

  <p align="center">
    This lib integrates Express server and all the elements the app needs in order to only keep the views, listeners and resources in the app project.
    <br />
    <br />
    <a href="https://github.com/lenra-io/app-lib-js/issues">Report Bug</a>
    ·
    <a href="https://github.com/lenra-io/app-lib-js/issues">Request Feature</a>
  </p>
</div>


<!-- USAGE EXAMPLES -->
## Usage

To incorporate it into your Lenra app project, simply run the following command:
```console
npm i @lenra/app-server
```

### Lenra API calls

To call a Lenra API from a listener, utilize the `Api` instance provided as the third parameter in your listener function. 

You can then create a document using the data API with the following code:
```js
class CustomType extends Data {
    /**
     * @param {string} value
     */
  constructor(value) {
    this.value = value;
  }
}

const myDoc = await api.data.coll(CustomType).createDoc(new CustomType("Hello world"));
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please open an issue with the tag "enhancement".
Don't forget to give the project a star if you liked it! Thanks again!

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the **MIT** License. See [LICENSE](./LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Lenra - [@lenra_dev](https://twitter.com/lenra_dev) - contact@lenra.io

Project Link: [https://github.com/lenra-io/app-lib-js](https://github.com/lenra-io/app-lib-js)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/lenra-io/app-lib-js.svg?style=for-the-badge
[contributors-url]: https://github.com/lenra-io/app-lib-js/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/lenra-io/app-lib-js.svg?style=for-the-badge
[forks-url]: https://github.com/lenra-io/app-lib-js/network/members
[stars-shield]: https://img.shields.io/github/stars/lenra-io/app-lib-js.svg?style=for-the-badge
[stars-url]: https://github.com/lenra-io/app-lib-js/stargazers
[issues-shield]: https://img.shields.io/github/issues/lenra-io/app-lib-js.svg?style=for-the-badge
[issues-url]: https://github.com/lenra-io/app-lib-js/issues
[license-shield]: https://img.shields.io/github/license/lenra-io/app-lib-js.svg?style=for-the-badge
[license-url]: https://github.com/lenra-io/app-lib-js/blob/master/LICENSE
