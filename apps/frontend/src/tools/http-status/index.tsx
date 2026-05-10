import { useState, useMemo } from 'react';
import ToolLayout from '../../components/ToolLayout';
import OutputBox from '../../components/OutputBox';
import CopyButton from '../../components/CopyButton';
import RadioGroup from '../../components/RadioGroup';
import { useI18n } from '../../hooks/useI18n';

interface StatusCode {
  code: number;
  name: string;
  description: string;
  category: string;
}

const STATUS_CODES: StatusCode[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', category: '1xx Informational', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', category: '1xx Informational', description: 'The server is switching protocols as requested by the client (e.g., upgrading to WebSocket).' },
  { code: 102, name: 'Processing', category: '1xx Informational', description: 'The server has received and is processing the request, but no response is available yet (WebDAV).' },
  { code: 103, name: 'Early Hints', category: '1xx Informational', description: 'Used to return some response headers before the final HTTP message, allowing the client to preload resources.' },

  // 2xx Success
  { code: 200, name: 'OK', category: '2xx Success', description: 'The request has succeeded. The meaning depends on the HTTP method used.' },
  { code: 201, name: 'Created', category: '2xx Success', description: 'The request has been fulfilled and a new resource has been created. Commonly used after POST requests.' },
  { code: 202, name: 'Accepted', category: '2xx Success', description: 'The request has been accepted for processing, but the processing has not been completed yet.' },
  { code: 203, name: 'Non-Authoritative Information', category: '2xx Success', description: 'The returned metadata is not exactly the same as available from the origin server. A modified version from a proxy.' },
  { code: 204, name: 'No Content', category: '2xx Success', description: 'The server successfully processed the request but is not returning any content. Common for DELETE operations.' },
  { code: 205, name: 'Reset Content', category: '2xx Success', description: 'The server successfully processed the request and asks the client to reset the document view.' },
  { code: 206, name: 'Partial Content', category: '2xx Success', description: 'The server is delivering only part of the resource due to a range header sent by the client (e.g., resumable downloads).' },
  { code: 207, name: 'Multi-Status', category: '2xx Success', description: 'A WebDAV response that conveys information about multiple resources where multiple status codes might be appropriate.' },
  { code: 208, name: 'Already Reported', category: '2xx Success', description: 'Used inside a WebDAV DAV:propstat response to avoid enumerating the same resource multiple times.' },
  { code: 226, name: 'IM Used', category: '2xx Success', description: 'The server has fulfilled a GET request for the resource, and the response represents the result of instance-manipulations.' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', category: '3xx Redirection', description: 'The request has more than one possible response. The user or user agent should choose one of them.' },
  { code: 301, name: 'Moved Permanently', category: '3xx Redirection', description: 'The resource has been permanently moved to a new URL. Search engines will update their links.' },
  { code: 302, name: 'Found', category: '3xx Redirection', description: 'The resource is temporarily located at a different URL. The client should continue using the original URL.' },
  { code: 303, name: 'See Other', category: '3xx Redirection', description: 'The response to the request can be found at another URL using a GET method.' },
  { code: 304, name: 'Not Modified', category: '3xx Redirection', description: 'The resource has not been modified since the last request. Used for caching with conditional requests.' },
  { code: 305, name: 'Use Proxy', category: '3xx Redirection', description: 'The requested resource must be accessed through the proxy given by the Location header. Deprecated.' },
  { code: 307, name: 'Temporary Redirect', category: '3xx Redirection', description: 'The resource is temporarily at a different URL. Unlike 302, the request method must not change.' },
  { code: 308, name: 'Permanent Redirect', category: '3xx Redirection', description: 'The resource has been permanently moved. Unlike 301, the request method must not change.' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', category: '4xx Client Error', description: 'The server cannot process the request due to malformed syntax, invalid framing, or deceptive routing.' },
  { code: 401, name: 'Unauthorized', category: '4xx Client Error', description: 'Authentication is required and has failed or has not yet been provided. The client must authenticate.' },
  { code: 402, name: 'Payment Required', category: '4xx Client Error', description: 'Reserved for future use. Some APIs use this for rate limiting or requiring payment.' },
  { code: 403, name: 'Forbidden', category: '4xx Client Error', description: 'The client does not have permission to access the resource, even with authentication.' },
  { code: 404, name: 'Not Found', category: '4xx Client Error', description: 'The server cannot find the requested resource. The most common error on the web.' },
  { code: 405, name: 'Method Not Allowed', category: '4xx Client Error', description: 'The HTTP method used is not supported for the requested resource (e.g., POST on a read-only resource).' },
  { code: 406, name: 'Not Acceptable', category: '4xx Client Error', description: 'The server cannot produce a response matching the list of acceptable values in the request headers.' },
  { code: 407, name: 'Proxy Authentication Required', category: '4xx Client Error', description: 'The client must first authenticate with the proxy before the request can be processed.' },
  { code: 408, name: 'Request Timeout', category: '4xx Client Error', description: 'The server timed out waiting for the request. The client may repeat the request without modifications.' },
  { code: 409, name: 'Conflict', category: '4xx Client Error', description: 'The request conflicts with the current state of the server (e.g., edit conflicts, duplicate resources).' },
  { code: 410, name: 'Gone', category: '4xx Client Error', description: 'The resource has been permanently deleted and will not be available again. Unlike 404, this is intentional.' },
  { code: 411, name: 'Length Required', category: '4xx Client Error', description: 'The server requires a Content-Length header in the request.' },
  { code: 412, name: 'Precondition Failed', category: '4xx Client Error', description: 'One or more conditions in the request header fields evaluated to false (e.g., If-Match).' },
  { code: 413, name: 'Payload Too Large', category: '4xx Client Error', description: 'The request entity is larger than the server is willing or able to process.' },
  { code: 414, name: 'URI Too Long', category: '4xx Client Error', description: 'The URI requested by the client is longer than the server is willing to interpret.' },
  { code: 415, name: 'Unsupported Media Type', category: '4xx Client Error', description: 'The media type of the request data is not supported by the server (e.g., sending XML when JSON is expected).' },
  { code: 416, name: 'Range Not Satisfiable', category: '4xx Client Error', description: 'The range specified in the Range header cannot be fulfilled. The range may be outside the target resource size.' },
  { code: 417, name: 'Expectation Failed', category: '4xx Client Error', description: 'The expectation given in the Expect request header could not be met by the server.' },
  { code: 418, name: "I'm a Teapot", category: '4xx Client Error', description: 'Any attempt to brew coffee with a teapot should result in this error. Defined in RFC 2324 as an April Fools joke.' },
  { code: 421, name: 'Misdirected Request', category: '4xx Client Error', description: 'The request was directed at a server that is not able to produce a response (e.g., wrong TLS certificate).' },
  { code: 422, name: 'Unprocessable Entity', category: '4xx Client Error', description: 'The request was well-formed but contained semantic errors (e.g., validation failures). Common in REST APIs.' },
  { code: 423, name: 'Locked', category: '4xx Client Error', description: 'The resource that is being accessed is locked (WebDAV).' },
  { code: 424, name: 'Failed Dependency', category: '4xx Client Error', description: 'The request failed because it depended on another request which failed (WebDAV).' },
  { code: 425, name: 'Too Early', category: '4xx Client Error', description: 'The server is unwilling to process a request that might be replayed (TLS early data).' },
  { code: 426, name: 'Upgrade Required', category: '4xx Client Error', description: 'The server refuses to perform the request using the current protocol but may do so after the client upgrades.' },
  { code: 428, name: 'Precondition Required', category: '4xx Client Error', description: 'The origin server requires the request to be conditional to prevent lost updates.' },
  { code: 429, name: 'Too Many Requests', category: '4xx Client Error', description: 'The user has sent too many requests in a given time period (rate limiting).' },
  { code: 431, name: 'Request Header Fields Too Large', category: '4xx Client Error', description: 'The server is unwilling to process the request because its header fields are too large.' },
  { code: 451, name: 'Unavailable For Legal Reasons', category: '4xx Client Error', description: 'The resource is unavailable due to legal demands (e.g., censorship, court order). Named after Fahrenheit 451.' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', category: '5xx Server Error', description: 'A generic server error when no more specific message is suitable.' },
  { code: 501, name: 'Not Implemented', category: '5xx Server Error', description: 'The server does not support the functionality required to fulfill the request.' },
  { code: 502, name: 'Bad Gateway', category: '5xx Server Error', description: 'The server, acting as a gateway or proxy, received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', category: '5xx Server Error', description: 'The server is temporarily unable to handle the request, usually due to maintenance or overload.' },
  { code: 504, name: 'Gateway Timeout', category: '5xx Server Error', description: 'The server, acting as a gateway or proxy, did not receive a timely response from the upstream server.' },
  { code: 505, name: 'HTTP Version Not Supported', category: '5xx Server Error', description: 'The server does not support the HTTP protocol version used in the request.' },
  { code: 506, name: 'Variant Also Negotiates', category: '5xx Server Error', description: 'Transparent content negotiation results in a circular reference.' },
  { code: 507, name: 'Insufficient Storage', category: '5xx Server Error', description: 'The server cannot store the representation needed to complete the request (WebDAV).' },
  { code: 508, name: 'Loop Detected', category: '5xx Server Error', description: 'The server detected an infinite loop while processing the request (WebDAV).' },
  { code: 510, name: 'Not Extended', category: '5xx Server Error', description: 'Further extensions to the request are required for the server to fulfill it.' },
  { code: 511, name: 'Network Authentication Required', category: '5xx Server Error', description: 'The client needs to authenticate to gain network access (e.g., captive portals).' },
];

const CATEGORIES = ['1xx Informational', '2xx Success', '3xx Redirection', '4xx Client Error', '5xx Server Error'];

const CATEGORY_COLORS: Record<string, string> = {
  '1xx Informational': 'badge-blue',
  '2xx Success': 'badge-green',
  '3xx Redirection': 'badge-yellow',
  '4xx Client Error': 'badge-orange',
  '5xx Server Error': 'badge-red',
};

export function HttpStatus() {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCodes = useMemo(() => {
    return STATUS_CODES.filter((sc) => {
      const matchesCategory = selectedCategory === 'all' || sc.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!search.trim()) return true;

      const q = search.trim().toLowerCase();
      return (
        String(sc.code).includes(q) ||
        sc.name.toLowerCase().includes(q) ||
        sc.description.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory]);

  const groupedCodes = useMemo(() => {
    const groups: Record<string, StatusCode[]> = {};
    for (const cat of CATEGORIES) {
      const codes = filteredCodes.filter((sc) => sc.category === cat);
      if (codes.length > 0) {
        groups[cat] = codes;
      }
    }
    return groups;
  }, [filteredCodes]);

  const selectedStatus = useMemo(() => {
    const code = parseInt(search.trim(), 10);
    if (isNaN(code)) return null;
    return STATUS_CODES.find((sc) => sc.code === code) || null;
  }, [search]);

  const detailText = selectedStatus
    ? `${selectedStatus.code} ${selectedStatus.name}\nCategory: ${selectedStatus.category}\n\n${selectedStatus.description}`
    : '';

  return (
    <ToolLayout title={t('HTTP Status Code Lookup')} description={t('Look up HTTP status codes with descriptions and use cases')}>
      <div className="space-y-4">
        <div className="card">
          <div>
            <label className="tool-label">{t('Search by Code or Keyword')}</label>
            <input
              type="text"
              className="tool-input"
              placeholder={t('Enter status code (e.g. 404) or keyword (e.g. not found)')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="tool-label">{t('Filter by Category')}</label>
            <RadioGroup
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: 'all', label: t('All') },
                ...CATEGORIES.map(cat => ({ value: cat, label: t(cat) })),
              ]}
            />
          </div>
        </div>

        {selectedStatus && (
          <div className={`card p-4 space-y-2 border ${CATEGORY_COLORS[selectedStatus.category]}`}>
            <div className="flex items-center justify-between">
              <label className="tool-label">
                {selectedStatus.code} {selectedStatus.name}
              </label>
              <CopyButton text={detailText} />
            </div>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border">
              {selectedStatus.category}
            </span>
            <OutputBox content={selectedStatus.description} />
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedCodes).map(([category, codes]) => (
            <div key={category}>
              <h3 className={`font-semibold text-sm mb-2 px-2 py-1 rounded inline-block ${CATEGORY_COLORS[category]}`}>
                {category} ({codes.length})
              </h3>
              <div className="space-y-2">
                {codes.map((sc) => (
                  <div
                    key={sc.code}
                    className="card p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSearch(String(sc.code))}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-lg min-w-[3rem]">{sc.code}</span>
                      <div className="flex-1">
                        <p className="font-medium">{sc.name}</p>
                        <p className="text-sm text-surface-400 mt-1">{sc.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredCodes.length === 0 && (
            <div className="card p-4 text-center text-surface-500">
              {t('No status codes match your search.')}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

export default HttpStatus;
