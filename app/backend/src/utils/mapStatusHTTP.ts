// pesquisa https://github.com/tryber/sd-027-a-live-lectures/blob/lecture/back/10.1/src/utils/mapStatusHTTP.ts
export default function mapStatusHTTP(status: string): number {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'UNAUTHORIZED': return 401;
    case 'NOT_FOUND': return 404;
    case 'INVALID_DATA': return 400;
    default: return 500;
  }
}
