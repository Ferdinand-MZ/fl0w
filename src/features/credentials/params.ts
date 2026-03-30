import {parseAsInteger, parseAsString} from 'nuqs/server';
import {PAGINATION} from "@/config/constants";

export const credentialsParams = {
    page: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({clearOnDefault: true}),
    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({clearOnDefault: true}),
    search: parseAsString
        .withDefault("")
        .withOptions({clearOnDefault: true}),
};

// fungsi clearOnDefault adalah merapihkan url,
// contoh tadi kita di page 2 workflows (localhost:3000/workflows?page=2)
// dan kita akan nge clear balik ke page 1, tanpa clearOnDefault hasilnya begini (localhost:3000/workflows?page=1)
// yang mana konyol karena bisa aja hasilnya sama dengan localhost:3000/workflows