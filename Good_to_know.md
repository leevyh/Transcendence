# What is File-Based Routing?

File-based routing is a technique where routes are defined by the file structure of your application. When a file is added to a specific directory, it automatically becomes a route in your navigation. This approach is particularly useful for React Native and web applications, as it allows for seamless navigation between different parts of the app’s UI.

# Examples and Implementations:

Expo Router: Expo Router is a file-based router for React Native and web applications. It allows you to manage navigation between screens in your app, using the same components on multiple platforms. When a file is added to the app directory, the file automatically becomes a route in your navigation.

TanStack Router: TanStack Router provides file-based routing through a bundler, which generates your route configuration through your bundler’s dev and build processes. With file-based routing enabled, TanStack Router watches your configured routes directory and generates your route tree whenever a file is added, removed, or changed.

Next.js: Next.js has a file-system based router built on concepts of pages. When a file is added to the pages directory, it’s automatically available as a route.

Vue.js: Automatic file-based routing in Vue.js is possible with unplugin-vue-router, which eliminates the need for manual route configuration and promotes a clean code structure.

# Key Takeaways:
File-based routing is a simple and intuitive approach to managing navigation in your application.
It’s particularly useful for React Native and web applications, as it allows for seamless navigation between different parts of the app’s UI.
File-based routing can be implemented using various libraries and frameworks, such as Expo Router, TanStack Router, Next.js, and Vue.js.
Automatic file-based routing can be achieved with tools like TanStack Router and unplugin-vue-router, which reduce boilerplate code and improve maintainability.





-------------------------------------------------------------------


# HTML
\<html lang=”fr”>  pour le français ; \
\<html lang=”en”>  pour l’anglais ; \
\<html lang=”es”>  pour l’espagnol…

- La balise en paire \<title> \</title> affiche le titre de la page dans l'onglet du navigateur.
- La balise en paire \<head> \</head> contient deux balises qui donnent des informations au navigateur : l’encodage et le titre de la page.
- La balise en paire \<body> \</body> contient tout ce qui sera affiché à l'écran sur la page web.
- Les balises \<p> \</p> permettent de délimiter des paragraphes en HTML.
- Pour revenir à la ligne, on utilise la balise orpheline \<br> (pour break), on n'a donc pas besoin de la fermer.

- Les balises de titres vont de \<h1> \</h1> jusqu'à \<h6> \</h6>, ce qui permet de hiérarchiser et structurer le texte dans différentes sections, du niveau le plus grand, au niveau le plus petit. \
/!\ Il faut toujours structurer sa page en commençant par un titre de niveau 1\<h1>, puis structurer l'intérieur avec des titres de niveau 2\<h2>, puis, si besoin de structurer l'intérieur, utiliser des titres de niveau 3, etc. \
Il ne devrait pas y avoir de sous-titre sans titre principal !

- Les balises \<li> \</li> (pour "listed item") permettent de baliser les éléments que l'on veut mettre dans une liste.
- Les balises \<ul> \</ul> (pour "unordered list") permettent d'indiquer qu'on démarre une liste non ordonnée, c'est-à-dire, ce que l'on appelle en français une liste à puces.
- Les balises \<ol> \</ol> (pour "ordered list") permettent d'indiquer qu'on démarre une liste ordonnée, autrement dit en français une liste numérotée.

- Les balises de texte :
\<mark> \</mark> : Surligner le texte. \
\<em> \</em> : Mettre le texte en italique. \
\<strong> \</strong> : Mettre le texte en gras.

- Ajouter un lien hypertexte avec la balise \<a> et l'attribut href: \
\<a href="https://openclassrooms.com/fr/">Accédez à OpenClassrooms\</a> \
Ce type de lien hypertexte s'appelle un lien absolu : il indique une adresse complète. \
\<a href="contenu/autredossier/page3.html">Page 3\</a> \
Ce type de lien hypertexte s'appelle un lien relatif : il indique où trouver notre fichier HTML.

- Créer une ancre avec les attributs id et href \
\<h2 id="mon_ancre">Titre\</h2> \
\<a href="index.html#jardin">Le jardin\</a> \
/!\ Évitez de créer des id  avec des espaces ou des caractères spéciaux ; utilisez simplement, dans la mesure du possible, des lettres et des chiffres pour que la valeur soit reconnue par tous les navigateurs.

- Insérez une image avec la balise orpheline \<img> \
\<img src="images/paysage.jpg" alt="Photo de plage vue du dessus" /> \
Voici quel format adopter en fonction de l'image que vous avez :
- Une photo : utilisez un JPEG.
- Une image avec peu de couleurs (moins de 256) : utilisez un PNG 8 bits, ou éventuellement un GIF.
- Une image avec beaucoup de couleurs : utilisez un PNG 24 bits.
- Une image animée : utilisez un GIF animé.
- Un logo vectoriel : utilisez un SVG.
