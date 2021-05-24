import requests
from requests.utils import get_encodings_from_content
from requests.packages.urllib3 import disable_warnings

def get_url(url):
    doc_html = ''
    if not url:
        return doc_html

    headers = {
        "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50"
    }
    try:
        disable_warnings()
        url = url_add_http(url)
        resp = requests.get(url, headers=headers, timeout=3, verify=False)
        resp.encoding = get_encode(resp)
        doc_html = resp.text
    except Exception as e:
        pass
    return doc_html

def get_encode(response):
    '''获取编码'''
    if 'Content-Type' in response.headers:
        ctp = response.headers['Content-Type'].lower()
        if 'utf-8' in ctp or 'utf8' in ctp:
            return 'utf-8'
        if 'gbk' in ctp or 'gb2312' in ctp:
            return 'gbk'
    rxt = response.text

    tmp_encode = get_encodings_from_content(rxt)
    if tmp_encode:
        return tmp_encode[0]

    tmp_encode = response.apparent_encoding
    if tmp_encode == 'ascii':
        return 'utf-8'

def url_add_http(url_path: str, ssl=False) -> str:
    '''添加http协议头'''

    if not url_path.startswith(("https://", "http://", "socks5://", "socks4://", "socks://")):
        if ssl:
            return r'https://' + url_path
        return r'http://' + url_path

    return url_path