export const revalidate = 0; //no cache

// https://tailwindcomponents.com/component/hoverable-table
import { redirect } from 'next/navigation';

import { Pagination, Title } from '@/components';

import { getPaginatedUsers } from '@/actions';
import { UsersTable } from './ui/UsersTable';

export default async function OrdersPage() {

    const { ok, users = [] } = await getPaginatedUsers()

    if (!ok) {
        redirect('/auth/login')
    }

    return (
        <>
            <Title title="Mantenimiento de usuarios" />
            <div className="mb-10">
                <UsersTable users={ users } />
                {/* todo: hacer la paginacion */}
            </div>
            <Pagination totalPages={1}/>
        </>
    );
}