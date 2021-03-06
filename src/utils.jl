"""
    MCIndices(sz::NTuple{N,AbstractVector{Int}}) -> R
    MCIndices(A::AbstractArray) -> R

A `CartesianIndices` like type defines mutable and disconnected region `R`.

# Examples

```jldoctest
julia> im = MCIndices(([1, 3], [2, 4]))
2×2 MCIndices{2}:
 (1, 2)  (1, 4)
 (3, 2)  (3, 4)

julia> im[1]
(1, 2)

julia> im[1, 2]
(1, 4)
```
"""
struct MCIndices{N} <: AbstractArray{Dims{N},N}
    indices::NTuple{N,Vector{Int}}
end
MCIndices(indices::NTuple{N,AbstractVector{Int}}) where {N} =
    MCIndices(map(collect, indices))
MCIndices(A::AbstractArray) = MCIndices(axes(A))

Base.size(im::MCIndices) = map(length, im.indices)

Base.@propagate_inbounds getdim(im::MCIndices, i::Int) = im.indices[i]
Base.@propagate_inbounds Base.getindex(im::MCIndices{N}, I::Vararg{Int,N}) where {N} =
    map(getindex, im.indices, I)::Dims{N}

# DOKArray
const DOK{T,N} = Dict{Dims{N},T}

"""
    DOKSparseArray{T,N}

A simple sparse array type storing as
[`DOK` format](https://en.wikipedia.org/wiki/Sparse_matrix#Dictionary_of_keys_(DOK)).
"""
struct DOKSparseArray{T,N} <: ResizingTools.AbstractRNArray{T,N}
    dok::DOK{T,N}
    sz::Size{N}
end

Base.parent(A::DOKSparseArray) = A.dok
Base.isassigned(A::DOKSparseArray, i::Integer...) =
    haskey(A.dok, Base._to_subscript_indices(A, i...))
ArrayInterface.parent_type(::Type{<:DOKSparseArray{T,N}}) where {T,N} = DOK{T,N}
ResizingTools.isresizable(::Type{<:DOKSparseArray}) = true
ResizingTools.has_resize_buffer(::Type{<:DOKSparseArray}) = true
ResizingTools.getsize(A::DOKSparseArray{T,N}) where {T,N} = A.sz
ResizingTools.size_type(::Type{<:DOKSparseArray{T,N}}) where {T,N} = Size{N}

function Base.getindex(A::DOKSparseArray{T,N}, I::Vararg{Int,N}) where {T,N}
    @boundscheck checkbounds(A, I...)
    return get(A.dok, I, zero(T))
end
# this methods not used in this package
function Base.setindex!(A::DOKSparseArray{T,N}, v, I::Vararg{Int,N}) where {T,N}
    @boundscheck checkbounds(A, I...)
    return A.dok[I] = v
end

# Tools
function Base.get!(A::DOKSparseArray{T,N}, I::Dims{N}, v::T) where {T,N}
    @boundscheck checkbounds(A, I...)
    return get!(A.dok, I, v)
end
Base.get(A::DOKSparseArray{T,N}, I::Dims{N}, default) where {T,N} =
    get(parent(A), I, default)
Base.get(A::DOKSparseArray{T,0}, I::Tuple{}, default) where {T} = get(parent(A), I, default) # to avoid ambiguities

Base.keys(A::DOKSparseArray) = CartesianIndex.(keys(parent(A)))
Base.values(A::DOKSparseArray) = values(parent(A))

# these two methods don't create elements, the elements are created by setindex!
function ResizingTools.resize_buffer!(A::DOKSparseArray{T,N}, sz::Vararg{Any,N}) where {T,N}
    sz′ = to_dims(sz)
    @boundscheck all(map(<=, size(A), sz′)) ||
                 throw(ArgumentError("new size must large than the old one"))
    setsize!(A, sz′)
    return A
end
function ResizingTools.resize_buffer_dim!(A::DOKSparseArray, d::Int, n)
    n′ = to_dims(n)
    @boundscheck size(A, d) <= n′ ||
                 throw(ArgumentError("new size must large than the old one"))
    setsize!(A, d, n′)
    return A
end
