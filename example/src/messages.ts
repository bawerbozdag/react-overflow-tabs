export type Lang = "en" | "zh" | "es" | "fr" | "pt" | "ru" | "ja" | "de" | "tr";

// the order of the language menu and of every list derived from it (hreflang, sitemap): English and Turkish first, then
// the other languages by how widely they are spoken
export const LANGS: Lang[] = ["en", "tr", "zh", "es", "fr", "pt", "ru", "ja", "de"];

export const LANG_NAMES: Record<Lang, string> = {
    en: "English",
    zh: "简体中文",
    es: "Español",
    fr: "Français",
    pt: "Português",
    ru: "Русский",
    ja: "日本語",
    de: "Deutsch",
    tr: "Türkçe",
};

interface IDemoText {
    title: string;
    // may contain <b>…</b> and <code>…</code>
    description: string;
}

export interface IMessages {
    htmlLang: string;
    ogLocale: string;
    language: string;
    meta: { title: string; description: string; keywords: string; imageAlt: string };
    header: { description: string; docs: string };
    ui: {
        containerWidth: string;
        containerHeight: string;
        addTab: string;
        removeLast: string;
        shuffle: string;
        activeTab: string;
        selected: string;
        none: string;
        disabled: string;
        showCode: string;
        skipToContent: string;
        codeExample: string;
        copy: string;
        copied: string;
        packageManager: string;
        more: (count: number) => string;
        newTab: (count: number) => string;
    };
    tabs: string[];
    mailboxes: string[];
    demos: {
        basic: IDemoText;
        pills: IDemoText;
        dynamic: IDemoText;
        customAttribute: IDemoText;
        elementContainer: IDemoText;
        rtl: IDemoText;
        vertical: IDemoText;
        chips: IDemoText;
        disabled: IDemoText;
    };
    faq: { title: string; items: { question: string; answer: string }[] };
}

const en: IMessages = {
    htmlLang: "en",
    ogLocale: "en_US",
    language: "Language",
    meta: {
        title: 'react-overflow-tabs: React tabs with a "More" dropdown',
        description:
            'Headless React hook that moves tabs that don\'t fit into a "More" dropdown. Under 1 kB, zero dependencies, works with Tailwind, Bootstrap, MUI or any CSS.',
        keywords:
            "react tabs, overflow tabs, more dropdown, priority plus navigation, responsive tabs, react hook, headless ui",
        imageAlt: "Tabs collapsing into an overflow dropdown as the container shrinks",
    },
    header: {
        description:
            'A headless hook that tells you which tabs fit and which ones belong in a "More" dropdown. Everything below is plain CSS; the hook renders nothing.',
        docs: "Docs",
    },
    ui: {
        containerWidth: "Container width",
        containerHeight: "Container height",
        addTab: "Add tab",
        removeLast: "Remove last",
        shuffle: "Shuffle",
        activeTab: "Active tab:",
        selected: "Selected:",
        none: "none",
        disabled: "disabled",
        showCode: "Show code",
        skipToContent: "Skip to content",
        codeExample: "Code example",
        copy: "Copy",
        copied: "Copied",
        packageManager: "Package manager",
        more: (count) => `More (${count})`,
        newTab: (count) => `Tab ${count}`,
    },
    tabs: ["Overview", "Analytics", "Reports", "Customers", "Products", "Orders", "Invoices", "Settings"],
    mailboxes: ["Inbox", "Starred", "Drafts", "Sent", "Archive", "Spam", "Trash", "Labels"],
    demos: {
        basic: {
            title: "Basic",
            description:
                "Drag the slider (or resize the window). Tabs that no longer fit move into the <b>More</b> menu one by one and come back as space frees up.",
        },
        pills: {
            title: "Pill style",
            description: "The hook is headless, so a different look is only different CSS. Same logic, rounded pills.",
        },
        dynamic: {
            title: "Dynamic tabs",
            description: "Tabs added, removed or reordered after mount are picked up automatically.",
        },
        customAttribute: {
            title: "Custom tab attribute",
            description:
                "Already marking your tabs with another attribute? Point the hook at it with <code>tabSelector</code>. Brackets are optional.",
        },
        elementContainer: {
            title: "Element instead of a ref",
            description:
                "<code>container</code> also accepts an <code>HTMLElement</code> directly, handy when the element comes from non-React code or a callback ref.",
        },
        rtl: {
            title: "Right-to-left",
            description: "The hook only tracks visibility, so RTL layouts work without any extra option.",
        },
        vertical: {
            title: "Vertical list",
            description:
                "Overflow works on any axis: a column with a fixed height and <code>overflow: hidden</code> behaves the same way. Here the slider changes the height.",
        },
        chips: {
            title: "Filter chips",
            description: "Not just tabs: any row of items works. Here, toggleable chips with a +N overflow menu.",
        },
        disabled: {
            title: "Disabled",
            description:
                "With <code>disabled</code> the hook stops tracking and reports every tab as visible, so the row just clips. Useful on mobile, where you may prefer horizontal scrolling.",
        },
    },
    faq: {
        title: "FAQ",
        items: [
            {
                question: "What is react-overflow-tabs?",
                answer: 'react-overflow-tabs is a headless React hook, under 1 kB with zero dependencies, that tells you which tabs fit in a container (visibleKeys) and which don\'t (overflowKeys), so you can move the rest into a "More" dropdown. It renders no markup or styles and works with Tailwind, Bootstrap, MUI or plain CSS. Install it with npm install react-overflow-tabs.',
            },
            {
                question: 'How do I make React tabs collapse into a "More" dropdown?',
                answer: "Wrap the tabs in a container with overflow: hidden, give each tab a data-overflow-key attribute, and call useOverflowTabs with a ref to that container. Hide the tabs listed in overflowKeys with visibility: hidden and render them inside your dropdown.",
            },
            {
                question: "Why hide overflowing tabs with visibility: hidden instead of display: none?",
                answer: "An element with display: none has no size or position, so the browser cannot tell whether it would fit again. visibility: hidden keeps the tab's space in the layout, which lets the hook bring it back as soon as there is room.",
            },
            {
                question: "Does react-overflow-tabs work with Next.js and server-side rendering?",
                answer: "Yes. The hook only touches the DOM inside effects, and in environments without IntersectionObserver every tab is reported as visible. In the Next.js App Router, use it inside a Client Component.",
            },
            {
                question: "Does it work vertically and with right-to-left layouts?",
                answer: "Yes. Visibility is measured with IntersectionObserver, which doesn't depend on the axis, so a column with a fixed height and overflow: hidden works the same way. RTL layouts need no extra option.",
            },
        ],
    },
};

const tr: IMessages = {
    htmlLang: "tr",
    ogLocale: "tr_TR",
    language: "Dil",
    meta: {
        title: 'react-overflow-tabs: "Daha fazla" menülü React sekmeleri',
        description:
            'Sığmayan sekmeleri "Daha fazla" menüsüne taşıyan headless React hook. 1 kB altında, bağımlılıksız; Tailwind, Bootstrap, MUI veya her CSS ile çalışır.',
        keywords:
            "react sekmeler, taşan sekmeler, daha fazla menüsü, priority plus navigasyon, duyarlı sekmeler, react hook, headless ui",
        imageAlt: "Kapsayıcı daraldıkça sekmelerin taşma menüsüne dönüşmesi",
    },
    header: {
        description:
            'Hangi sekmelerin sığdığını ve hangilerinin "Daha fazla" menüsüne ait olduğunu söyleyen, arayüzden bağımsız (headless) bir hook. Aşağıdaki her şey düz CSS; hook hiçbir şey render etmez.',
        docs: "Dokümantasyon",
    },
    ui: {
        containerWidth: "Kapsayıcı genişliği",
        containerHeight: "Kapsayıcı yüksekliği",
        addTab: "Sekme ekle",
        removeLast: "Sonuncuyu sil",
        shuffle: "Karıştır",
        activeTab: "Aktif sekme:",
        selected: "Seçilen:",
        none: "yok",
        disabled: "devre dışı",
        showCode: "Kodu göster",
        skipToContent: "İçeriğe geç",
        codeExample: "Kod örneği",
        copy: "Kopyala",
        copied: "Kopyalandı",
        packageManager: "Paket yöneticisi",
        more: (count) => `Daha fazla (${count})`,
        newTab: (count) => `Sekme ${count}`,
    },
    tabs: ["Genel Bakış", "Analitik", "Raporlar", "Müşteriler", "Ürünler", "Siparişler", "Faturalar", "Ayarlar"],
    mailboxes: ["Gelen Kutusu", "Yıldızlı", "Taslaklar", "Gönderilenler", "Arşiv", "Spam", "Çöp Kutusu", "Etiketler"],
    demos: {
        basic: {
            title: "Temel",
            description:
                "Slider'ı sürükleyin (ya da pencereyi yeniden boyutlandırın). Sığmayan sekmeler tek tek <b>Daha fazla</b> menüsüne geçer, yer açıldıkça geri döner.",
        },
        pills: {
            title: "Hap (pill) stili",
            description:
                "Hook arayüzden bağımsız olduğu için farklı bir görünüm yalnızca farklı bir CSS demektir. Aynı mantık, yuvarlak hap şeklinde sekmeler.",
        },
        dynamic: {
            title: "Dinamik sekmeler",
            description: "Mount'tan sonra eklenen, silinen ya da yeniden sıralanan sekmeler otomatik algılanır.",
        },
        customAttribute: {
            title: "Özel sekme attribute'u",
            description:
                "Sekmelerinizi zaten başka bir attribute ile mi işaretliyorsunuz? Hook'u <code>tabSelector</code> ile ona yönlendirin. Köşeli parantezler isteğe bağlıdır.",
        },
        elementContainer: {
            title: "Ref yerine element",
            description:
                "<code>container</code> doğrudan bir <code>HTMLElement</code> de kabul eder; element React dışı koddan ya da callback ref'ten geldiğinde işe yarar.",
        },
        rtl: {
            title: "Sağdan sola",
            description: "Hook yalnızca görünürlüğü takip ettiği için RTL düzenler ek bir seçenek olmadan çalışır.",
        },
        vertical: {
            title: "Dikey liste",
            description:
                "Taşma her eksende çalışır: sabit yükseklikli ve <code>overflow: hidden</code> olan bir sütun aynı şekilde davranır. Burada slider yüksekliği değiştirir.",
        },
        chips: {
            title: "Filtre chip'leri",
            description:
                "Yalnızca sekmeler değil: herhangi bir öğe sırası çalışır. Burada, +N taşma menüsü olan, açılıp kapanabilen chip'ler.",
        },
        disabled: {
            title: "Devre dışı",
            description:
                "<code>disabled</code> ile hook takibi durdurur ve her sekmeyi görünür raporlar, yani satır sadece kırpılır. Yatay kaydırmayı tercih edebileceğiniz mobilde işe yarar.",
        },
    },
    faq: {
        title: "SSS",
        items: [
            {
                question: "react-overflow-tabs nedir?",
                answer: 'react-overflow-tabs, 1 kB altında ve bağımlılıksız, arayüzden bağımsız (headless) bir React hook\'udur. Bir kapsayıcıda hangi sekmelerin sığdığını (visibleKeys) ve hangilerinin sığmadığını (overflowKeys) söyler; böylece geri kalanı bir "Daha fazla" açılır menüsüne taşıyabilirsiniz. Hiçbir markup veya stil üretmez; Tailwind, Bootstrap, MUI ya da düz CSS ile çalışır. npm install react-overflow-tabs ile kurulur.',
            },
            {
                question: 'React sekmelerini nasıl "Daha fazla" açılır menüsüne dönüştürürüm?',
                answer: "Sekmeleri overflow: hidden olan bir container içine alın, her sekmeye bir data-overflow-key attribute'u verin ve o container'a bir ref ile useOverflowTabs'i çağırın. overflowKeys içindeki sekmeleri visibility: hidden ile gizleyin ve açılır menünüzde gösterin.",
            },
            {
                question: "Taşan sekmeleri neden display: none yerine visibility: hidden ile gizlemeliyim?",
                answer: "display: none olan bir elementin boyutu ve konumu olmaz, bu yüzden tarayıcı onun tekrar sığıp sığmayacağını söyleyemez. visibility: hidden sekmenin yerini düzende korur; böylece hook yer açılır açılmaz onu geri getirebilir.",
            },
            {
                question: "react-overflow-tabs Next.js ve sunucu taraflı render ile çalışır mı?",
                answer: "Evet. Hook DOM'a yalnızca effect'ler içinde dokunur ve IntersectionObserver olmayan ortamlarda her sekme görünür raporlanır. Next.js App Router'da bir Client Component içinde kullanın.",
            },
            {
                question: "Dikey listelerde ve sağdan sola düzenlerde çalışır mı?",
                answer: "Evet. Görünürlük eksenden bağımsız olan IntersectionObserver ile ölçülür; bu yüzden sabit yükseklikli ve overflow: hidden olan bir sütun aynı şekilde çalışır. RTL düzenler için ek bir seçenek gerekmez.",
            },
        ],
    },
};

const es: IMessages = {
    htmlLang: "es",
    ogLocale: "es_ES",
    language: "Idioma",
    meta: {
        title: 'react-overflow-tabs: pestañas React con menú "Más"',
        description:
            'Hook de React headless que pasa las pestañas que no caben a un menú "Más". Menos de 1 kB, sin dependencias; funciona con Tailwind, Bootstrap, MUI o CSS.',
        keywords:
            "pestañas react, pestañas con desbordamiento, menú más, navegación priority plus, pestañas adaptables, hook de react, headless ui",
        imageAlt: "Pestañas que pasan a un menú de desbordamiento al reducirse el contenedor",
    },
    header: {
        description:
            'Un hook sin interfaz (headless) que te dice qué pestañas caben y cuáles pertenecen a un menú desplegable "Más". Todo lo que ves abajo es CSS simple; el hook no renderiza nada.',
        docs: "Documentación",
    },
    ui: {
        containerWidth: "Ancho del contenedor",
        containerHeight: "Alto del contenedor",
        addTab: "Añadir pestaña",
        removeLast: "Quitar la última",
        shuffle: "Mezclar",
        activeTab: "Pestaña activa:",
        selected: "Seleccionados:",
        none: "ninguno",
        disabled: "desactivado",
        showCode: "Mostrar código",
        skipToContent: "Saltar al contenido",
        codeExample: "Ejemplo de código",
        copy: "Copiar",
        copied: "Copiado",
        packageManager: "Gestor de paquetes",
        more: (count) => `Más (${count})`,
        newTab: (count) => `Pestaña ${count}`,
    },
    tabs: ["Resumen", "Analíticas", "Informes", "Clientes", "Productos", "Pedidos", "Facturas", "Ajustes"],
    mailboxes: ["Recibidos", "Destacados", "Borradores", "Enviados", "Archivo", "Spam", "Papelera", "Etiquetas"],
    demos: {
        basic: {
            title: "Básico",
            description:
                "Arrastra el control deslizante (o cambia el tamaño de la ventana). Las pestañas que ya no caben pasan una a una al menú <b>Más</b> y vuelven cuando hay espacio.",
        },
        pills: {
            title: "Estilo píldora",
            description:
                "El hook no tiene interfaz propia, así que otro aspecto es solo otro CSS. Misma lógica, píldoras redondeadas.",
        },
        dynamic: {
            title: "Pestañas dinámicas",
            description:
                "Las pestañas añadidas, eliminadas o reordenadas después del montaje se detectan automáticamente.",
        },
        customAttribute: {
            title: "Atributo de pestaña personalizado",
            description:
                "¿Ya marcas tus pestañas con otro atributo? Apunta el hook hacia él con <code>tabSelector</code>. Los corchetes son opcionales.",
        },
        elementContainer: {
            title: "Elemento en lugar de ref",
            description:
                "<code>container</code> también acepta directamente un <code>HTMLElement</code>, útil cuando el elemento viene de código ajeno a React o de un callback ref.",
        },
        rtl: {
            title: "De derecha a izquierda",
            description:
                "El hook solo sigue la visibilidad, por lo que los diseños RTL funcionan sin ninguna opción adicional.",
        },
        vertical: {
            title: "Lista vertical",
            description:
                "El desbordamiento funciona en cualquier eje: una columna con altura fija y <code>overflow: hidden</code> se comporta igual. Aquí el control deslizante cambia la altura.",
        },
        chips: {
            title: "Chips de filtro",
            description:
                "No solo pestañas: cualquier fila de elementos sirve. Aquí, chips activables con un menú de desbordamiento +N.",
        },
        disabled: {
            title: "Desactivado",
            description:
                "Con <code>disabled</code> el hook deja de seguir y marca todas las pestañas como visibles, así que la fila simplemente se recorta. Útil en móvil, donde quizá prefieras el desplazamiento horizontal.",
        },
    },
    faq: {
        title: "Preguntas frecuentes",
        items: [
            {
                question: "¿Qué es react-overflow-tabs?",
                answer: 'react-overflow-tabs es un hook de React sin interfaz (headless), de menos de 1 kB y sin dependencias, que indica qué pestañas caben en un contenedor (visibleKeys) y cuáles no (overflowKeys), para que puedas pasar el resto a un menú desplegable "Más". No renderiza marcado ni estilos y funciona con Tailwind, Bootstrap, MUI o CSS simple. Se instala con npm install react-overflow-tabs.',
            },
            {
                question: '¿Cómo hago que las pestañas de React se agrupen en un menú desplegable "Más"?',
                answer: "Envuelve las pestañas en un contenedor con overflow: hidden, dale a cada pestaña un atributo data-overflow-key y llama a useOverflowTabs con una ref a ese contenedor. Oculta con visibility: hidden las pestañas de overflowKeys y renderízalas dentro de tu menú desplegable.",
            },
            {
                question: "¿Por qué ocultar las pestañas desbordadas con visibility: hidden en lugar de display: none?",
                answer: "Un elemento con display: none no tiene tamaño ni posición, así que el navegador no puede saber si volvería a caber. visibility: hidden conserva el espacio de la pestaña en el diseño, lo que permite al hook recuperarla en cuanto hay sitio.",
            },
            {
                question: "¿Funciona react-overflow-tabs con Next.js y renderizado en el servidor?",
                answer: "Sí. El hook solo toca el DOM dentro de efectos y, en entornos sin IntersectionObserver, todas las pestañas se marcan como visibles. En el App Router de Next.js, úsalo dentro de un Client Component.",
            },
            {
                question: "¿Funciona en vertical y en diseños de derecha a izquierda?",
                answer: "Sí. La visibilidad se mide con IntersectionObserver, que no depende del eje, así que una columna con altura fija y overflow: hidden funciona igual. Los diseños RTL no necesitan ninguna opción adicional.",
            },
        ],
    },
};

const zh: IMessages = {
    htmlLang: "zh-CN",
    ogLocale: "zh_CN",
    language: "语言",
    meta: {
        title: "react-overflow-tabs：带“更多”菜单的 React 标签页",
        description:
            "放不下的标签页自动收进“更多”菜单的无界面 React Hook。小于 1 kB、零依赖，支持 Tailwind、Bootstrap、MUI 及任意 CSS。",
        keywords: "react 标签页, 溢出标签, 更多菜单, priority plus 导航, 自适应标签页, react hook, headless ui",
        imageAlt: "容器缩小时，标签页收起到溢出下拉菜单",
    },
    header: {
        description:
            "一个无界面（headless）的 Hook，告诉你哪些标签页放得下，哪些应放进“更多”下拉菜单。下面的一切都是纯 CSS，Hook 本身不渲染任何内容。",
        docs: "文档",
    },
    ui: {
        containerWidth: "容器宽度",
        containerHeight: "容器高度",
        addTab: "添加标签页",
        removeLast: "删除最后一个",
        shuffle: "打乱顺序",
        activeTab: "当前标签页：",
        selected: "已选择：",
        none: "无",
        disabled: "已禁用",
        showCode: "显示代码",
        skipToContent: "跳到内容",
        codeExample: "代码示例",
        copy: "复制",
        copied: "已复制",
        packageManager: "包管理器",
        more: (count) => `更多 (${count})`,
        newTab: (count) => `标签页 ${count}`,
    },
    tabs: ["概览", "数据分析", "报告", "客户", "产品", "订单", "发票", "设置"],
    mailboxes: ["收件箱", "星标邮件", "草稿", "已发送", "归档", "垃圾邮件", "已删除", "标签"],
    demos: {
        basic: {
            title: "基础",
            description: "拖动滑块（或调整窗口大小）。放不下的标签页会逐个移入<b>更多</b>菜单，空间恢复后再回来。",
        },
        pills: {
            title: "胶囊样式",
            description: "该 Hook 不带界面，所以换一种外观只需换一套 CSS。逻辑不变，只是圆角胶囊。",
        },
        dynamic: { title: "动态标签页", description: "挂载之后新增、删除或重新排序的标签页会被自动识别。" },
        customAttribute: {
            title: "自定义标签属性",
            description:
                "已经用别的属性标记标签页了？通过 <code>tabSelector</code> 让 Hook 指向它即可，方括号可写可不写。",
        },
        elementContainer: {
            title: "传入元素而非 ref",
            description:
                "<code>container</code> 也可以直接接收 <code>HTMLElement</code>，适用于元素来自非 React 代码或 callback ref 的场景。",
        },
        rtl: { title: "从右到左", description: "该 Hook 只跟踪可见性，因此 RTL 布局无需任何额外选项。" },
        vertical: {
            title: "垂直列表",
            description:
                "溢出在任何方向上都有效：固定高度且设置了 <code>overflow: hidden</code> 的列表表现一致。这里滑块调整的是高度。",
        },
        chips: {
            title: "筛选标签",
            description: "不只是标签页，任何一行元素都适用。这里是可切换的筛选标签，带有 +N 溢出菜单。",
        },
        disabled: {
            title: "已禁用",
            description:
                "设置 <code>disabled</code> 后，Hook 停止跟踪并将所有标签页视为可见，整行只会被裁剪。适合更希望横向滚动的移动端。",
        },
    },
    faq: {
        title: "常见问题",
        items: [
            {
                question: "react-overflow-tabs 是什么？",
                answer: "react-overflow-tabs 是一个体积小于 1 kB、零依赖的无界面（headless）React Hook。它会告诉你哪些标签页能放进容器（visibleKeys），哪些放不下（overflowKeys），这样就可以把其余的放进“更多”下拉菜单。它不输出任何标记或样式，可搭配 Tailwind、Bootstrap、MUI 或纯 CSS 使用。通过 npm install react-overflow-tabs 安装。",
            },
            {
                question: "如何让 React 标签页收起到“更多”下拉菜单？",
                answer: "将标签页放进设置了 overflow: hidden 的容器，为每个标签页添加 data-overflow-key 属性，并用指向该容器的 ref 调用 useOverflowTabs。用 visibility: hidden 隐藏 overflowKeys 中列出的标签页，并把它们渲染到你的下拉菜单里。",
            },
            {
                question: "为什么用 visibility: hidden 而不是 display: none 来隐藏溢出的标签页？",
                answer: "display: none 的元素没有尺寸和位置，浏览器无法判断它能否重新放下。visibility: hidden 会在布局中保留标签页的位置，因此一旦有空间，Hook 就能把它恢复出来。",
            },
            {
                question: "react-overflow-tabs 能用于 Next.js 和服务端渲染吗？",
                answer: "可以。Hook 只在 effect 中操作 DOM，在没有 IntersectionObserver 的环境中会把所有标签页视为可见。在 Next.js App Router 中，请在 Client Component 里使用。",
            },
            {
                question: "支持垂直方向和从右到左的布局吗？",
                answer: "支持。可见性通过与方向无关的 IntersectionObserver 测量，因此固定高度且设置了 overflow: hidden 的列表同样适用，RTL 布局也无需任何额外选项。",
            },
        ],
    },
};

const ja: IMessages = {
    htmlLang: "ja",
    ogLocale: "ja_JP",
    language: "言語",
    meta: {
        title: "react-overflow-tabs：「もっと見る」付き React タブ",
        description:
            "収まらないタブを「もっと見る」メニューにまとめるヘッドレス React フック。1 kB 未満・依存なしで、Tailwind、Bootstrap、MUI、任意の CSS に対応。",
        keywords:
            "react タブ, オーバーフロー タブ, もっと見る メニュー, priority plus ナビゲーション, レスポンシブ タブ, react フック, ヘッドレス ui",
        imageAlt: "コンテナが狭くなるとタブがオーバーフローのドロップダウンにまとまる様子",
    },
    header: {
        description:
            "どのタブが収まり、どのタブを「もっと見る」ドロップダウンに入れるべきかを教えてくれるヘッドレスなフックです。以下はすべて素の CSS で、フック自体は何も描画しません。",
        docs: "ドキュメント",
    },
    ui: {
        containerWidth: "コンテナの幅",
        containerHeight: "コンテナの高さ",
        addTab: "タブを追加",
        removeLast: "最後を削除",
        shuffle: "シャッフル",
        activeTab: "アクティブなタブ：",
        selected: "選択中：",
        none: "なし",
        disabled: "無効",
        showCode: "コードを表示",
        skipToContent: "コンテンツへスキップ",
        codeExample: "コード例",
        copy: "コピー",
        copied: "コピーしました",
        packageManager: "パッケージマネージャー",
        more: (count) => `もっと見る (${count})`,
        newTab: (count) => `タブ ${count}`,
    },
    tabs: ["概要", "分析", "レポート", "顧客", "商品", "注文", "請求書", "設定"],
    mailboxes: ["受信トレイ", "スター付き", "下書き", "送信済み", "アーカイブ", "迷惑メール", "ゴミ箱", "ラベル"],
    demos: {
        basic: {
            title: "基本",
            description:
                "スライダーをドラッグ（またはウィンドウのサイズを変更）してください。収まらなくなったタブは 1 つずつ<b>もっと見る</b>メニューに移り、スペースが空くと戻ります。",
        },
        pills: {
            title: "ピル型スタイル",
            description:
                "このフックはヘッドレスなので、見た目を変えるには CSS を変えるだけです。ロジックは同じで、角丸のピル型にしています。",
        },
        dynamic: {
            title: "動的なタブ",
            description: "マウント後に追加・削除・並べ替えされたタブは自動的に検出されます。",
        },
        customAttribute: {
            title: "カスタムのタブ属性",
            description:
                "すでに別の属性でタブを識別していますか？ <code>tabSelector</code> でフックにその属性を指定できます。角括弧は省略可能です。",
        },
        elementContainer: {
            title: "ref の代わりに要素",
            description:
                "<code>container</code> には <code>HTMLElement</code> も直接渡せます。React 以外のコードや callback ref から要素を取得する場合に便利です。",
        },
        rtl: {
            title: "右から左",
            description: "フックは可視性を追跡するだけなので、RTL レイアウトも追加のオプションなしで動作します。",
        },
        vertical: {
            title: "縦リスト",
            description:
                "オーバーフローはどの方向でも機能します。高さが固定で <code>overflow: hidden</code> の縦のカラムも同じように動作します。ここではスライダーが高さを変更します。",
        },
        chips: {
            title: "フィルターチップ",
            description:
                "タブだけではありません。要素の並びであれば何でも使えます。ここでは +N のオーバーフローメニューを持つ、切り替え可能なチップです。",
        },
        disabled: {
            title: "無効",
            description:
                "<code>disabled</code> を指定するとフックは追跡を止め、すべてのタブを表示中として扱うため、行は単に切り取られます。横スクロールのほうが好ましいモバイルで便利です。",
        },
    },
    faq: {
        title: "よくある質問",
        items: [
            {
                question: "react-overflow-tabs とは？",
                answer: "react-overflow-tabs は、1 kB 未満で依存関係のないヘッドレスな React フックです。コンテナに収まるタブ（visibleKeys）と収まらないタブ（overflowKeys）を教えてくれるので、残りを「もっと見る」ドロップダウンに移せます。マークアップもスタイルも出力せず、Tailwind、Bootstrap、MUI、素の CSS で使えます。インストールは npm install react-overflow-tabs です。",
            },
            {
                question: "React のタブを「もっと見る」ドロップダウンにまとめるには？",
                answer: "タブを overflow: hidden のコンテナで囲み、各タブに data-overflow-key 属性を付け、そのコンテナへの ref を渡して useOverflowTabs を呼び出します。overflowKeys に含まれるタブは visibility: hidden で隠し、ドロップダウン内に描画してください。",
            },
            {
                question: "あふれたタブを display: none ではなく visibility: hidden で隠すのはなぜ？",
                answer: "display: none の要素にはサイズも位置もないため、ブラウザは再び収まるかどうかを判断できません。visibility: hidden ならタブの場所がレイアウトに残るので、空きができ次第フックがタブを元に戻せます。",
            },
            {
                question: "react-overflow-tabs は Next.js やサーバーサイドレンダリングで動作しますか？",
                answer: "はい。フックは effect の中でのみ DOM に触れ、IntersectionObserver がない環境ではすべてのタブが表示中として扱われます。Next.js の App Router では Client Component の中で使用してください。",
            },
            {
                question: "縦方向や右から左のレイアウトでも動作しますか？",
                answer: "はい。可視性は軸に依存しない IntersectionObserver で測定するため、高さ固定で overflow: hidden の縦のカラムでも同じように動作します。RTL レイアウトに追加のオプションは不要です。",
            },
        ],
    },
};

const pt: IMessages = {
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    language: "Idioma",
    meta: {
        title: 'react-overflow-tabs: abas React com menu "Mais"',
        description:
            'Hook React headless que move as abas que não cabem para um menu "Mais". Menos de 1 kB, sem dependências; funciona com Tailwind, Bootstrap, MUI ou CSS.',
        keywords:
            "abas react, abas com overflow, menu mais, navegação priority plus, abas responsivas, hook react, headless ui",
        imageAlt: "Abas passando para um menu de overflow conforme o contêiner diminui",
    },
    header: {
        description:
            'Um hook headless que diz quais abas cabem e quais devem ir para um menu suspenso "Mais". Tudo abaixo é CSS puro; o hook não renderiza nada.',
        docs: "Documentação",
    },
    ui: {
        containerWidth: "Largura do contêiner",
        containerHeight: "Altura do contêiner",
        addTab: "Adicionar aba",
        removeLast: "Remover a última",
        shuffle: "Embaralhar",
        activeTab: "Aba ativa:",
        selected: "Selecionados:",
        none: "nenhum",
        disabled: "desativado",
        showCode: "Mostrar código",
        skipToContent: "Pular para o conteúdo",
        codeExample: "Exemplo de código",
        copy: "Copiar",
        copied: "Copiado",
        packageManager: "Gerenciador de pacotes",
        more: (count) => `Mais (${count})`,
        newTab: (count) => `Aba ${count}`,
    },
    tabs: ["Visão geral", "Análises", "Relatórios", "Clientes", "Produtos", "Pedidos", "Faturas", "Configurações"],
    mailboxes: [
        "Caixa de entrada",
        "Com estrela",
        "Rascunhos",
        "Enviados",
        "Arquivados",
        "Spam",
        "Lixeira",
        "Marcadores",
    ],
    demos: {
        basic: {
            title: "Básico",
            description:
                "Arraste o controle deslizante (ou redimensione a janela). As abas que deixam de caber vão uma a uma para o menu <b>Mais</b> e voltam quando há espaço.",
        },
        pills: {
            title: "Estilo pílula",
            description:
                "O hook é headless, então outro visual é apenas outro CSS. Mesma lógica, pílulas arredondadas.",
        },
        dynamic: {
            title: "Abas dinâmicas",
            description: "Abas adicionadas, removidas ou reordenadas após a montagem são detectadas automaticamente.",
        },
        customAttribute: {
            title: "Atributo de aba personalizado",
            description:
                "Já marca suas abas com outro atributo? Aponte o hook para ele com <code>tabSelector</code>. Os colchetes são opcionais.",
        },
        elementContainer: {
            title: "Elemento em vez de ref",
            description:
                "<code>container</code> também aceita um <code>HTMLElement</code> diretamente, útil quando o elemento vem de código fora do React ou de um callback ref.",
        },
        rtl: {
            title: "Da direita para a esquerda",
            description: "O hook apenas acompanha a visibilidade, então layouts RTL funcionam sem nenhuma opção extra.",
        },
        vertical: {
            title: "Lista vertical",
            description:
                "O overflow funciona em qualquer eixo: uma coluna com altura fixa e <code>overflow: hidden</code> se comporta da mesma forma. Aqui o controle deslizante altera a altura.",
        },
        chips: {
            title: "Chips de filtro",
            description:
                "Não são só abas: qualquer linha de itens funciona. Aqui, chips alternáveis com um menu de overflow +N.",
        },
        disabled: {
            title: "Desativado",
            description:
                "Com <code>disabled</code>, o hook para de monitorar e trata todas as abas como visíveis, então a linha apenas é cortada. Útil no celular, onde você pode preferir rolagem horizontal.",
        },
    },
    faq: {
        title: "Perguntas frequentes",
        items: [
            {
                question: "O que é o react-overflow-tabs?",
                answer: 'O react-overflow-tabs é um hook React headless, com menos de 1 kB e sem dependências, que informa quais abas cabem em um contêiner (visibleKeys) e quais não cabem (overflowKeys), para que você mova o restante para um menu suspenso "Mais". Ele não renderiza marcação nem estilos e funciona com Tailwind, Bootstrap, MUI ou CSS puro. Instale com npm install react-overflow-tabs.',
            },
            {
                question: 'Como faço as abas do React se agruparem em um menu suspenso "Mais"?',
                answer: "Envolva as abas em um contêiner com overflow: hidden, dê a cada aba um atributo data-overflow-key e chame useOverflowTabs com uma ref para esse contêiner. Oculte com visibility: hidden as abas listadas em overflowKeys e renderize-as dentro do seu menu suspenso.",
            },
            {
                question: "Por que ocultar abas com overflow usando visibility: hidden em vez de display: none?",
                answer: "Um elemento com display: none não tem tamanho nem posição, então o navegador não consegue saber se ele voltaria a caber. visibility: hidden mantém o espaço da aba no layout, o que permite ao hook trazê-la de volta assim que houver espaço.",
            },
            {
                question: "O react-overflow-tabs funciona com Next.js e renderização no servidor?",
                answer: "Sim. O hook só toca o DOM dentro de effects e, em ambientes sem IntersectionObserver, todas as abas são reportadas como visíveis. No App Router do Next.js, use-o dentro de um Client Component.",
            },
            {
                question: "Funciona na vertical e em layouts da direita para a esquerda?",
                answer: "Sim. A visibilidade é medida com IntersectionObserver, que não depende do eixo, então uma coluna com altura fixa e overflow: hidden funciona da mesma forma. Layouts RTL não precisam de nenhuma opção extra.",
            },
        ],
    },
};

const ru: IMessages = {
    htmlLang: "ru",
    ogLocale: "ru_RU",
    language: "Язык",
    meta: {
        title: "react-overflow-tabs: React-вкладки с меню «Ещё»",
        description:
            "Headless React-хук: вкладки, которые не помещаются, уходят в меню «Ещё». Меньше 1 кБ, без зависимостей, работает с Tailwind, Bootstrap, MUI и любым CSS.",
        keywords:
            "react вкладки, переполнение вкладок, меню ещё, priority plus навигация, адаптивные вкладки, react хук, headless ui",
        imageAlt: "Вкладки сворачиваются в меню переполнения при уменьшении контейнера",
    },
    header: {
        description:
            "Headless-хук, который сообщает, какие вкладки помещаются, а какие нужно убрать в выпадающее меню «Ещё». Всё ниже — обычный CSS, сам хук ничего не рендерит.",
        docs: "Документация",
    },
    ui: {
        containerWidth: "Ширина контейнера",
        containerHeight: "Высота контейнера",
        addTab: "Добавить вкладку",
        removeLast: "Удалить последнюю",
        shuffle: "Перемешать",
        activeTab: "Активная вкладка:",
        selected: "Выбрано:",
        none: "ничего",
        disabled: "отключено",
        showCode: "Показать код",
        skipToContent: "Перейти к содержимому",
        codeExample: "Пример кода",
        copy: "Копировать",
        copied: "Скопировано",
        packageManager: "Менеджер пакетов",
        more: (count) => `Ещё (${count})`,
        newTab: (count) => `Вкладка ${count}`,
    },
    tabs: ["Обзор", "Аналитика", "Отчёты", "Клиенты", "Товары", "Заказы", "Счета", "Настройки"],
    mailboxes: ["Входящие", "Помеченные", "Черновики", "Отправленные", "Архив", "Спам", "Корзина", "Метки"],
    demos: {
        basic: {
            title: "Базовый",
            description:
                "Перетащите ползунок (или измените размер окна). Вкладки, которые перестали помещаться, по одной переходят в меню <b>Ещё</b> и возвращаются, когда появляется место.",
        },
        pills: {
            title: "Стиль «таблетка»",
            description:
                "Хук headless, поэтому другой внешний вид — это просто другой CSS. Та же логика, скруглённые таблетки.",
        },
        dynamic: {
            title: "Динамические вкладки",
            description:
                "Вкладки, добавленные, удалённые или переупорядоченные после монтирования, обнаруживаются автоматически.",
        },
        customAttribute: {
            title: "Свой атрибут вкладки",
            description:
                "Уже помечаете вкладки другим атрибутом? Укажите его хуку через <code>tabSelector</code>. Квадратные скобки необязательны.",
        },
        elementContainer: {
            title: "Элемент вместо ref",
            description:
                "<code>container</code> также принимает <code>HTMLElement</code> напрямую — удобно, когда элемент приходит из не-React кода или из callback ref.",
        },
        rtl: {
            title: "Справа налево",
            description: "Хук отслеживает только видимость, поэтому RTL-раскладки работают без дополнительных опций.",
        },
        vertical: {
            title: "Вертикальный список",
            description:
                "Переполнение работает по любой оси: колонка с фиксированной высотой и <code>overflow: hidden</code> ведёт себя так же. Здесь ползунок меняет высоту.",
        },
        chips: {
            title: "Чипы-фильтры",
            description:
                "Не только вкладки: подойдёт любой ряд элементов. Здесь — переключаемые чипы с меню переполнения +N.",
        },
        disabled: {
            title: "Отключено",
            description:
                "С <code>disabled</code> хук прекращает отслеживание и считает все вкладки видимыми, поэтому ряд просто обрезается. Полезно на мобильных, где может быть удобнее горизонтальная прокрутка.",
        },
    },
    faq: {
        title: "Частые вопросы",
        items: [
            {
                question: "Что такое react-overflow-tabs?",
                answer: "react-overflow-tabs — это headless React-хук размером меньше 1 кБ и без зависимостей. Он сообщает, какие вкладки помещаются в контейнер (visibleKeys), а какие нет (overflowKeys), чтобы остальные можно было убрать в выпадающее меню «Ещё». Он не рендерит разметку и стили и работает с Tailwind, Bootstrap, MUI или обычным CSS. Установка: npm install react-overflow-tabs.",
            },
            {
                question: "Как свернуть React-вкладки в выпадающее меню «Ещё»?",
                answer: "Оберните вкладки в контейнер с overflow: hidden, добавьте каждой вкладке атрибут data-overflow-key и вызовите useOverflowTabs с ref на этот контейнер. Скройте вкладки из overflowKeys с помощью visibility: hidden и отрисуйте их в своём выпадающем меню.",
            },
            {
                question: "Почему переполняющие вкладки скрывают через visibility: hidden, а не display: none?",
                answer: "У элемента с display: none нет ни размера, ни позиции, поэтому браузер не может определить, поместился бы он снова. visibility: hidden сохраняет место вкладки в разметке, и хук может вернуть её сразу, как только появится место.",
            },
            {
                question: "Работает ли react-overflow-tabs с Next.js и серверным рендерингом?",
                answer: "Да. Хук обращается к DOM только внутри эффектов, а в средах без IntersectionObserver все вкладки считаются видимыми. В Next.js App Router используйте его внутри Client Component.",
            },
            {
                question: "Работает ли он по вертикали и в раскладках справа налево?",
                answer: "Да. Видимость измеряется через IntersectionObserver, который не зависит от оси, поэтому колонка с фиксированной высотой и overflow: hidden работает так же. Для RTL-раскладок дополнительные опции не нужны.",
            },
        ],
    },
};

const de: IMessages = {
    htmlLang: "de",
    ogLocale: "de_DE",
    language: "Sprache",
    meta: {
        title: "react-overflow-tabs: React-Tabs mit „Mehr“-Dropdown",
        description:
            "Headless React-Hook, der Tabs ohne Platz in ein „Mehr“-Dropdown verschiebt. Unter 1 kB, ohne Abhängigkeiten; passt zu Tailwind, Bootstrap, MUI und jedem CSS.",
        keywords:
            "react tabs, overflow tabs, mehr dropdown, priority plus navigation, responsive tabs, react hook, headless ui",
        imageAlt: "Tabs, die sich beim Verkleinern des Containers in ein Overflow-Dropdown zusammenfassen",
    },
    header: {
        description:
            "Ein Headless-Hook, der dir sagt, welche Tabs hineinpassen und welche in ein „Mehr“-Dropdown gehören. Alles unten ist reines CSS; der Hook rendert nichts.",
        docs: "Dokumentation",
    },
    ui: {
        containerWidth: "Container-Breite",
        containerHeight: "Container-Höhe",
        addTab: "Tab hinzufügen",
        removeLast: "Letzten entfernen",
        shuffle: "Mischen",
        activeTab: "Aktiver Tab:",
        selected: "Ausgewählt:",
        none: "keine",
        disabled: "deaktiviert",
        showCode: "Code anzeigen",
        skipToContent: "Zum Inhalt springen",
        codeExample: "Codebeispiel",
        copy: "Kopieren",
        copied: "Kopiert",
        packageManager: "Paketmanager",
        more: (count) => `Mehr (${count})`,
        newTab: (count) => `Tab ${count}`,
    },
    tabs: ["Übersicht", "Analysen", "Berichte", "Kunden", "Produkte", "Bestellungen", "Rechnungen", "Einstellungen"],
    mailboxes: ["Posteingang", "Markiert", "Entwürfe", "Gesendet", "Archiv", "Spam", "Papierkorb", "Labels"],
    demos: {
        basic: {
            title: "Einfach",
            description:
                "Ziehe den Schieberegler (oder ändere die Fenstergröße). Tabs, die nicht mehr passen, wandern einzeln in das <b>Mehr</b>-Menü und kehren zurück, sobald wieder Platz ist.",
        },
        pills: {
            title: "Pill-Stil",
            description:
                "Der Hook ist headless, ein anderes Aussehen ist also nur anderes CSS. Gleiche Logik, abgerundete Pills.",
        },
        dynamic: {
            title: "Dynamische Tabs",
            description:
                "Tabs, die nach dem Mounten hinzugefügt, entfernt oder umsortiert werden, werden automatisch erkannt.",
        },
        customAttribute: {
            title: "Eigenes Tab-Attribut",
            description:
                "Du kennzeichnest deine Tabs schon mit einem anderen Attribut? Verweise den Hook mit <code>tabSelector</code> darauf. Eckige Klammern sind optional.",
        },
        elementContainer: {
            title: "Element statt Ref",
            description:
                "<code>container</code> akzeptiert auch direkt ein <code>HTMLElement</code> – praktisch, wenn das Element aus Nicht-React-Code oder von einem Callback-Ref stammt.",
        },
        rtl: {
            title: "Rechts nach links",
            description:
                "Der Hook verfolgt nur die Sichtbarkeit, daher funktionieren RTL-Layouts ohne zusätzliche Option.",
        },
        vertical: {
            title: "Vertikale Liste",
            description:
                "Overflow funktioniert in jeder Richtung: Eine Spalte mit fester Höhe und <code>overflow: hidden</code> verhält sich genauso. Hier ändert der Schieberegler die Höhe.",
        },
        chips: {
            title: "Filter-Chips",
            description:
                "Nicht nur Tabs: Jede Reihe von Elementen funktioniert. Hier umschaltbare Chips mit einem +N-Overflow-Menü.",
        },
        disabled: {
            title: "Deaktiviert",
            description:
                "Mit <code>disabled</code> hört der Hook auf zu messen und meldet jeden Tab als sichtbar, die Zeile wird also einfach abgeschnitten. Nützlich auf Mobilgeräten, wo du vielleicht horizontales Scrollen bevorzugst.",
        },
    },
    faq: {
        title: "Häufige Fragen",
        items: [
            {
                question: "Was ist react-overflow-tabs?",
                answer: "react-overflow-tabs ist ein Headless-React-Hook mit weniger als 1 kB und ohne Abhängigkeiten. Er meldet, welche Tabs in einen Container passen (visibleKeys) und welche nicht (overflowKeys), damit du den Rest in ein „Mehr“-Dropdown verschieben kannst. Er rendert weder Markup noch Styles und funktioniert mit Tailwind, Bootstrap, MUI oder reinem CSS. Installation: npm install react-overflow-tabs.",
            },
            {
                question: "Wie lasse ich React-Tabs in einem „Mehr“-Dropdown zusammenfallen?",
                answer: "Umschließe die Tabs mit einem Container mit overflow: hidden, gib jedem Tab ein data-overflow-key-Attribut und rufe useOverflowTabs mit einem Ref auf diesen Container auf. Verstecke die in overflowKeys aufgeführten Tabs mit visibility: hidden und rendere sie in deinem Dropdown.",
            },
            {
                question: "Warum überlaufende Tabs mit visibility: hidden statt display: none verstecken?",
                answer: "Ein Element mit display: none hat weder Größe noch Position, der Browser kann also nicht sagen, ob es wieder passen würde. visibility: hidden behält den Platz des Tabs im Layout, sodass der Hook ihn zurückholen kann, sobald wieder Platz ist.",
            },
            {
                question: "Funktioniert react-overflow-tabs mit Next.js und Server-Side-Rendering?",
                answer: "Ja. Der Hook greift nur innerhalb von Effects auf das DOM zu, und in Umgebungen ohne IntersectionObserver werden alle Tabs als sichtbar gemeldet. Verwende ihn im Next.js App Router innerhalb einer Client Component.",
            },
            {
                question: "Funktioniert es vertikal und in Rechts-nach-links-Layouts?",
                answer: "Ja. Die Sichtbarkeit wird mit IntersectionObserver gemessen, der nicht von der Achse abhängt; eine Spalte mit fester Höhe und overflow: hidden funktioniert daher genauso. RTL-Layouts brauchen keine zusätzliche Option.",
            },
        ],
    },
};

const fr: IMessages = {
    htmlLang: "fr",
    ogLocale: "fr_FR",
    language: "Langue",
    meta: {
        title: "react-overflow-tabs : onglets React avec menu « Plus »",
        description:
            "Hook React headless qui range les onglets qui ne tiennent pas dans un menu « Plus ». Moins de 1 ko, sans dépendance ; compatible Tailwind, Bootstrap, MUI.",
        keywords:
            "onglets react, onglets débordement, menu plus, navigation priority plus, onglets adaptatifs, hook react, headless ui",
        imageAlt: "Des onglets qui passent dans un menu de débordement lorsque le conteneur rétrécit",
    },
    header: {
        description:
            "Un hook headless qui vous indique quels onglets tiennent et lesquels doivent aller dans un menu déroulant « Plus ». Tout ce qui suit est du CSS simple ; le hook ne rend rien.",
        docs: "Documentation",
    },
    ui: {
        containerWidth: "Largeur du conteneur",
        containerHeight: "Hauteur du conteneur",
        addTab: "Ajouter un onglet",
        removeLast: "Supprimer le dernier",
        shuffle: "Mélanger",
        activeTab: "Onglet actif :",
        selected: "Sélection :",
        none: "aucune",
        disabled: "désactivé",
        showCode: "Afficher le code",
        skipToContent: "Aller au contenu",
        codeExample: "Exemple de code",
        copy: "Copier",
        copied: "Copié",
        packageManager: "Gestionnaire de paquets",
        more: (count) => `Plus (${count})`,
        newTab: (count) => `Onglet ${count}`,
    },
    tabs: ["Aperçu", "Analyses", "Rapports", "Clients", "Produits", "Commandes", "Factures", "Paramètres"],
    mailboxes: ["Boîte de réception", "Favoris", "Brouillons", "Envoyés", "Archives", "Spam", "Corbeille", "Libellés"],
    demos: {
        basic: {
            title: "Basique",
            description:
                "Faites glisser le curseur (ou redimensionnez la fenêtre). Les onglets qui ne tiennent plus passent un à un dans le menu <b>Plus</b> et reviennent dès que la place se libère.",
        },
        pills: {
            title: "Style pilule",
            description:
                "Le hook est headless : changer d’apparence, c’est juste changer de CSS. Même logique, pilules arrondies.",
        },
        dynamic: {
            title: "Onglets dynamiques",
            description: "Les onglets ajoutés, supprimés ou réordonnés après le montage sont détectés automatiquement.",
        },
        customAttribute: {
            title: "Attribut d’onglet personnalisé",
            description:
                "Vous marquez déjà vos onglets avec un autre attribut ? Indiquez-le au hook avec <code>tabSelector</code>. Les crochets sont facultatifs.",
        },
        elementContainer: {
            title: "Élément au lieu d’une ref",
            description:
                "<code>container</code> accepte aussi directement un <code>HTMLElement</code>, pratique quand l’élément vient de code hors React ou d’une callback ref.",
        },
        rtl: {
            title: "De droite à gauche",
            description:
                "Le hook ne suit que la visibilité, donc les mises en page RTL fonctionnent sans option supplémentaire.",
        },
        vertical: {
            title: "Liste verticale",
            description:
                "Le débordement fonctionne sur n’importe quel axe : une colonne de hauteur fixe avec <code>overflow: hidden</code> se comporte de la même façon. Ici, le curseur modifie la hauteur.",
        },
        chips: {
            title: "Puces de filtre",
            description:
                "Pas seulement des onglets : n’importe quelle rangée d’éléments convient. Ici, des puces à bascule avec un menu de débordement +N.",
        },
        disabled: {
            title: "Désactivé",
            description:
                "Avec <code>disabled</code>, le hook arrête le suivi et signale tous les onglets comme visibles : la rangée est simplement tronquée. Utile sur mobile, où vous préférerez peut-être le défilement horizontal.",
        },
    },
    faq: {
        title: "Questions fréquentes",
        items: [
            {
                question: "Qu’est-ce que react-overflow-tabs ?",
                answer: "react-overflow-tabs est un hook React headless, de moins de 1 ko et sans dépendance, qui indique quels onglets tiennent dans un conteneur (visibleKeys) et lesquels non (overflowKeys), afin de ranger les autres dans un menu déroulant « Plus ». Il ne génère ni balisage ni style et fonctionne avec Tailwind, Bootstrap, MUI ou du CSS simple. Installation : npm install react-overflow-tabs.",
            },
            {
                question: "Comment faire passer des onglets React dans un menu déroulant « Plus » ?",
                answer: "Placez les onglets dans un conteneur avec overflow: hidden, donnez à chaque onglet un attribut data-overflow-key, puis appelez useOverflowTabs avec une ref vers ce conteneur. Masquez avec visibility: hidden les onglets listés dans overflowKeys et affichez-les dans votre menu déroulant.",
            },
            {
                question:
                    "Pourquoi masquer les onglets qui débordent avec visibility: hidden plutôt que display: none ?",
                answer: "Un élément en display: none n’a ni taille ni position, donc le navigateur ne peut pas savoir s’il tiendrait de nouveau. visibility: hidden conserve la place de l’onglet dans la mise en page, ce qui permet au hook de le faire revenir dès qu’il y a de la place.",
            },
            {
                question: "react-overflow-tabs fonctionne-t-il avec Next.js et le rendu côté serveur ?",
                answer: "Oui. Le hook ne touche au DOM que dans des effets, et dans les environnements sans IntersectionObserver, tous les onglets sont signalés comme visibles. Dans l’App Router de Next.js, utilisez-le dans un Client Component.",
            },
            {
                question: "Fonctionne-t-il à la verticale et en mise en page de droite à gauche ?",
                answer: "Oui. La visibilité est mesurée avec IntersectionObserver, qui ne dépend pas de l’axe : une colonne de hauteur fixe avec overflow: hidden fonctionne donc de la même façon. Les mises en page RTL ne demandent aucune option supplémentaire.",
            },
        ],
    },
};

export const messages: Record<Lang, IMessages> = { en, zh, es, fr, pt, ru, ja, de, tr };
