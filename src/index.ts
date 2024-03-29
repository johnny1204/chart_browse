import DomParser from "dom-parser";
import express, { Application, Request, Response } from 'express';
import process from 'process';
const puppeteer = require('puppeteer');

const app: Application = express()
const PORT = 3000

const relativeToabsolute = (dom: DomParser.Dom): Array<string> => {
    const hrefs: Array<string> = []
    dom.getElementsByTagName('link')?.forEach((elem) => {
        const href = elem.getAttribute('href')!
        if (href.indexOf("http") === -1) {
            hrefs.push(href)
        }
    })
    dom.getElementsByTagName('script')?.forEach((elem) => {
        const href = elem.getAttribute('src')
        if (href && href.indexOf("/web") === 0) {
            hrefs.push(href)
        }
    })
    
    return hrefs;
}

app.get('/', async (_req: Request, res: Response) => {
    return res.status(200).sendFile(__dirname + "/index.html")
});

app.get('/close', async (_req: Request, res: Response) => {
    process.kill(process.pid);
});

app.get('/carendar', async (req: Request, res: Response) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const path = req.query.path as string
    await page.goto(`https://daiwa.ifis.co.jp/index.php?${decodeURIComponent(path)}`);
    let renderHtml: string = await page.content();
    browser.close()

    const parser = new DomParser();
    let dom = parser.parseFromString(renderHtml);
    relativeToabsolute(dom).forEach((href) => {
        renderHtml = renderHtml.replace(href, `https://daiwa.ifis.co.jp/${href}`)
    });

    parser.parseFromString(renderHtml).getElementsByTagName('a')?.forEach((elem) => {
        const onclick = elem.getAttribute('onclick')!
        if (onclick) {
            renderHtml = renderHtml.replace(onclick, "")
        }
    });

    renderHtml = renderHtml.replaceAll("/img/", `img/`)
    renderHtml = renderHtml.replaceAll("img/", `https://daiwa.ifis.co.jp/img/`)
    renderHtml = renderHtml.replaceAll("index.php", `https://daiwa.ifis.co.jp/index.php`)

    return res.status(200).send(renderHtml)
})

try {
    app.listen(PORT, () => {
        console.log(`dev server running at: http://localhost:${PORT}/`)
    })
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message)
    }
}
