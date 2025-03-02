import * as XLSX from 'xlsx';

export const stripHtmlTags = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };



interface RowData {
  id: number;
  url: string;
  date: string;
  views: number;
  forwards: number;
  comments: number;
  emojis: number;
  er: number;
  text: {
    text: string;
  };
}

export const downloadXlsx = (filteredRows: RowData[]) => {
  const worksheet = XLSX.utils.json_to_sheet(filteredRows.map((row: RowData) => ({
    ID: row.url,
    URL: `https://t.me/albumsweekly/${row.url}`,
    Date: row.date,
    Views: row.views,
    Shares: row.forwards,
    Comments: row.comments,
    Reactions: row.emojis,
    'Engagement Rate': row.er,
    Content: row.text.text,
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');
  XLSX.writeFile(workbook, 'messages.xlsx');
};